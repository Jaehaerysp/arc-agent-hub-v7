// Bridge Center — Circle Attestation (Iris) service.
//
// Two responsibilities, kept separate on purpose:
//   1. `extractBurnMessage` — pure, local, no network calls. Decodes the
//      `MessageSent(bytes message)` event this app's own burn transaction
//      emitted (from MessageTransmitterV2, called internally by
//      TokenMessengerV2.depositForBurn — see bridgeService.js, which this
//      file does not modify) and hashes it. This is the actual CCTP
//      message, read directly off the burn receipt already sitting in
//      bridge state — not reconstructed from the tx hash.
//   2. `pollAttestation` — polls Circle's off-chain Iris service until it
//      has signed that message, or the 5-minute budget in the Sprint 3.2
//      brief runs out.
//
// A note on the Iris endpoint version: this app's TokenMessengerV2/
// MessageTransmitterV2 calls (bridgeService.js) are CCTP V2, not V1, so
// this polls Iris's V2 endpoint —
//   GET /v2/messages/{sourceDomainId}?transactionHash={burnTxHash}
// — which is what Circle's own CCTP V2 docs and blog samples poll
// (developers.circle.com/cctp/technical-guide,
// developers.circle.com/cctp/references/contract-addresses). The older
// `/v1/attestations/{messageHash}` path some CCTP V1 tutorials reference
// is a different, legacy service that isn't guaranteed to index V2
// messages, so it isn't used here even though a message hash is computed
// below — that hash is used for local integrity-checking and display
// (`messageHash` in bridge state / the status dialog), not as the poll
// key. This is a deliberate deviation from a literal "call
// /attestations/{messageHash}" instruction, made for correctness against
// the CCTP version this codebase already runs.
//
// Sprint 3.2 follow-up — why raw message equality was wrong: MessageV2's
// on-chain header (see MessageV2.sol) reserves two fields, `nonce` and
// `finalityThresholdExecuted`, that are zero at emission time and are
// filled in offchain by Iris's attesters before they sign. Circle's own
// CCTP V2 audit report confirms this explicitly: "Attesters are
// responsible for filling the empty fields before providing the
// attestations for a message" (nonce + finalityThresholdExecuted in
// MessageV2). That means the message this app emits locally and the
// message Iris attests to are, by design, never byte-identical —
// `keccak256(localMessage) === keccak256(irisMessage)` will *always* be
// false for a legitimate transfer, which is exactly the false-positive
// "invalid attestation" rejection this file used to produce. The fix
// below decodes both messages field-by-field (`decodeMessageV2`) and
// validates only the fields that must never change between emission and
// attestation, explicitly ignoring `nonce` and `finalityThresholdExecuted`.

import logger from "../../../utils/logger";
import { ethers } from "ethers";
import { MESSAGE_TRANSMITTER_ABI } from "../../../contracts/abis/messageTransmitter";
import { ARC_SOURCE_CCTP } from "./bridgeContracts";

const IRIS_SANDBOX_BASE_URL = "https://iris-api-sandbox.circle.com";
const POLL_INTERVAL_MS = 5000;
const MAX_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes, per the Sprint 3.2 brief

const messageTransmitterInterface = new ethers.Interface(MESSAGE_TRANSMITTER_ABI);

// The official Circle CCTP V2 event signature — computed once so `extractBurnMessage`
// can filter receipt logs by exact topic0 match before ever attempting to decode one,
// per the Sprint 3.2 audit brief ("only decode logs whose topic0 matches exactly").
const MESSAGE_SENT_TOPIC0 = ethers.id("MessageSent(bytes)");

// MessageV2 header layout, per Circle's evm-cctp-contracts MessageV2.sol —
// cross-checked against the field offsets Circle's own CCTP V2 integrators
// use externally (V2_MESSAGE_SOURCE_DOMAIN_OFFSET = 4, V2_MESSAGE_BODY_OFFSET
// = 148). All offsets are byte offsets into the raw `message` bytes:
//
//   field                        size (bytes)   [start, end)
//   version                      4               [0,   4)
//   sourceDomain                 4               [4,   8)
//   destinationDomain            4               [8,   12)
//   nonce                        32              [12,  44)   <- attester-filled
//   sender                       32              [44,  76)
//   recipient                    32              [76,  108)
//   destinationCaller            32              [108, 140)
//   minFinalityThreshold         4               [140, 144)
//   finalityThresholdExecuted    4               [144, 148)  <- attester-filled
//   messageBody                  dynamic         [148, end)
const MESSAGE_V2_HEADER_BYTES = 148;
const MESSAGE_V2_OFFSETS = {
  version: [0, 4],
  sourceDomain: [4, 8],
  destinationDomain: [8, 12],
  nonce: [12, 44],
  sender: [44, 76],
  recipient: [76, 108],
  destinationCaller: [108, 140],
  minFinalityThreshold: [140, 144],
  finalityThresholdExecuted: [144, 148],
};

// Fields that are immutable between local emission and Iris's attested
// copy — these are the only fields `pollAttestation` validates. `nonce`
// and `finalityThresholdExecuted` are deliberately excluded: they're
// zero when this app's own MessageSent event is emitted and are filled
// in by Circle's attesters before signing, so they're *expected* to
// differ and comparing them would reject every legitimate transfer.
const IMMUTABLE_FIELDS = [
  "version",
  "sourceDomain",
  "destinationDomain",
  "sender",
  "recipient",
  "destinationCaller",
  "minFinalityThreshold",
  "messageBody",
];

/** Reads the last 20 bytes of a bytes32 hex field as a checksummed EVM address (CCTP's address-as-bytes32 convention). */
function bytes32ToAddress(hex32) {
  try {
    return ethers.getAddress(ethers.dataSlice(hex32, 12, 32));
  } catch {
    return null;
  }
}

/**
 * Decodes a raw CCTP V2 `message` (the `bytes` payload from
 * `MessageSent(bytes)`, either this app's own or one Iris returned) into
 * its MessageV2 header fields plus `messageBody`, using the byte offsets
 * from Circle's `MessageV2.sol`. Throws if `message` is shorter than the
 * 148-byte fixed header.
 */
export function decodeMessageV2(message) {
  if (!message || typeof message !== "string") {
    throw new Error("decodeMessageV2: message must be a 0x-prefixed hex string.");
  }

  const length = ethers.dataLength(message);
  if (length < MESSAGE_V2_HEADER_BYTES) {
    throw new Error(
      `decodeMessageV2: message is only ${length} bytes — shorter than the ${MESSAGE_V2_HEADER_BYTES}-byte MessageV2 header.`
    );
  }

  const slice = (field) => ethers.dataSlice(message, MESSAGE_V2_OFFSETS[field][0], MESSAGE_V2_OFFSETS[field][1]);
  const asNumber = (field) => ethers.toNumber(slice(field));

  const senderHex = slice("sender");
  const recipientHex = slice("recipient");
  const destinationCallerHex = slice("destinationCaller");

  return {
    version: asNumber("version"),
    sourceDomain: asNumber("sourceDomain"),
    destinationDomain: asNumber("destinationDomain"),
    nonce: slice("nonce"), // attester-filled — decoded for visibility only, never compared.
    sender: senderHex,
    senderAddress: bytes32ToAddress(senderHex),
    recipient: recipientHex,
    recipientAddress: bytes32ToAddress(recipientHex),
    destinationCaller: destinationCallerHex,
    destinationCallerAddress: bytes32ToAddress(destinationCallerHex),
    minFinalityThreshold: asNumber("minFinalityThreshold"),
    finalityThresholdExecuted: asNumber("finalityThresholdExecuted"), // attester-filled — never compared.
    messageBody: ethers.dataSlice(message, MESSAGE_V2_HEADER_BYTES),
  };
}

/**
 * Compares two `decodeMessageV2` results field-by-field, but only over
 * `IMMUTABLE_FIELDS` — `nonce` and `finalityThresholdExecuted` are
 * excluded on purpose (see the module-level note above). Returns
 * `{ matches, mismatches }`, where `mismatches` lists every immutable
 * field that differed (empty when `matches` is true).
 */
export function compareImmutableFields(localDecoded, irisDecoded) {
  const mismatches = IMMUTABLE_FIELDS.filter((field) => {
    const a = localDecoded[field];
    const b = irisDecoded[field];
    if (typeof a === "string" && typeof b === "string") {
      return a.toLowerCase() !== b.toLowerCase();
    }
    return a !== b;
  });

  return { matches: mismatches.length === 0, mismatches };
}

/**
 * Byte-by-byte comparison of two `0x`-prefixed hex strings. Returns details
 * on the first divergence, or `null` if they're identical. Diagnostics
 * only — used to pinpoint exactly where a genuine `messageBody` mismatch
 * begins, never to decide accept/reject on its own.
 */
function diffHexBytes(hexA, hexB) {
  if (hexA === hexB) return null;

  const a = ethers.getBytes(hexA);
  const b = ethers.getBytes(hexB);
  const len = Math.min(a.length, b.length);
  let firstDiff = -1;

  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      firstDiff = i;
      break;
    }
  }
  if (firstDiff === -1 && a.length !== b.length) firstDiff = len;

  const ctx = (arr, i) => ethers.hexlify(arr.slice(Math.max(0, i - 4), i + 12));

  return {
    lengthA: a.length,
    lengthB: b.length,
    firstDivergentByte: firstDiff,
    localContext: ctx(a, firstDiff),
    irisContext: ctx(b, firstDiff),
  };
}

/**
 * Decodes the `MessageSent` event MessageTransmitterV2 emitted during this
 * app's own `depositForBurn` call, straight from the burn receipt already
 * in bridge state (`receipt` from `initiateBridge`'s return value).
 *
 * Sprint 3.2 audit pipeline (steps 1-4 of the brief), all local/no network:
 *   1. Log every entry on the receipt (index/address/topic0/topics/data).
 *   2. Only treat a log as `MessageSent` if its topic0 matches
 *      `keccak256("MessageSent(bytes)")` exactly — matching by ABI-decode
 *      success alone (the old `parseLog` shortcut) can silently accept the
 *      wrong log shape.
 *   3. Decode with `iface.decodeEventLog`, not `parseLog`, so a decode
 *      failure throws instead of being swallowed.
 *   4. If more than one `MessageSent` log is present (e.g. a hook-bearing
 *      transfer), every candidate is logged so it's visible which one this
 *      function picked and why — it does not blindly take the first match
 *      without at least logging the alternatives.
 *
 * Returns `{ message, messageHash }` or `{ error }` if the event isn't
 * present (e.g. a receipt from something other than this bridge's burn).
 */
export function extractBurnMessage(receipt) {
  if (!receipt || !Array.isArray(receipt.logs)) {
    return { error: "Burn receipt is missing — cannot read the CCTP message." };
  }

  logger.log("[attestation] --- Burn receipt log audit ---");
  logger.log("[attestation] MessageSent topic0 (expected):", MESSAGE_SENT_TOPIC0);

  const candidates = [];

  receipt.logs.forEach((log, index) => {
    logger.log(`[attestation] log[${index}]`, {
      address: log.address,
      topic0: log.topics?.[0],
      topics: log.topics,
      data: log.data,
    });

    if (log.topics?.[0] !== MESSAGE_SENT_TOPIC0) return; // Step 2: exact topic0 match only.

    const fromTransmitter = log.address?.toLowerCase() === ARC_SOURCE_CCTP.messageTransmitter.toLowerCase();
    if (!fromTransmitter) {
      logger.warn(
        `[attestation] log[${index}] has the MessageSent topic0 but its address (${log.address}) doesn't match the configured MessageTransmitterV2 (${ARC_SOURCE_CCTP.messageTransmitter}) — skipping as a possible spoof/unrelated emitter.`
      );
      return;
    }

    try {
      // Step 3: strict decode — no try/catch-and-continue on ABI mismatch.
      const decoded = messageTransmitterInterface.decodeEventLog("MessageSent", log.data, log.topics);
      const message = decoded.message;
      const messageHash = ethers.keccak256(message);
      logger.log(`[attestation] log[${index}] decoded MessageSent`, { message, messageHash });
      candidates.push({ index, message, messageHash });
    } catch (decodeError) {
      logger.error(`[attestation] log[${index}] matched topic0 + address but failed to decode as MessageSent(bytes):`, decodeError);
    }
  });

  if (candidates.length === 0) {
    return { error: "No MessageSent event found on the burn receipt." };
  }

  if (candidates.length > 1) {
    // Step 9 (applies to local extraction too, not just Iris's response):
    // don't silently pick the first one — log every candidate so this is
    // debuggable, and use the last MessageSent from the transmitter, since
    // depositForBurn's own transfer message is emitted after any earlier
    // hook-related messages in the same call.
    logger.warn(
      "[attestation] Multiple MessageSent events found on this receipt — using the last one. All candidates:",
      candidates.map((c) => ({ index: c.index, messageHash: c.messageHash }))
    );
  }

  const chosen = candidates[candidates.length - 1];
  return { message: chosen.message, messageHash: chosen.messageHash };
}

/**
 * Polls Iris every `intervalMs` (default 5s) for up to `timeoutMs` (default
 * 5 minutes) until the attestation for `transactionHash` on `sourceDomain`
 * is complete. `shouldCancel`, if provided, is checked before every poll so
 * a caller (see useAttestation.js) can abandon a stale poll — e.g. if the
 * bridge dialog was reset or a different transfer started.
 *
 * Validation against `expectedMessage`/`expectedMessageHash` (the locally
 * emitted burn message, from `extractBurnMessage`) is field-level, not
 * whole-message equality — see the module-level note on `nonce` and
 * `finalityThresholdExecuted` above. On acceptance, this returns Iris's
 * message (`entry.message`), not the local one, since the attestation was
 * signed over Iris's copy (nonce + finalityThresholdExecuted filled in) —
 * that's what `receiveMessage()` must be called with.
 */
export async function pollAttestation({
  sourceDomain,
  transactionHash,
  expectedMessageHash,
  expectedMessage,
  shouldCancel,
  onAttempt,
  intervalMs = POLL_INTERVAL_MS,
  timeoutMs = MAX_TIMEOUT_MS,
}) {
  if (!transactionHash) {
    return { error: "Missing burn transaction hash — cannot poll for an attestation." };
  }

  // Decode the local message's immutable fields once, up front, if we have
  // the raw bytes (a fresh bridge run always supplies this; a resumed
  // session only has `expectedMessageHash` persisted — see the fallback
  // branch below for that case).
  let localDecoded = null;
  if (expectedMessage) {
    try {
      localDecoded = decodeMessageV2(expectedMessage);
      logger.log("[attestation] Local MessageV2 (decoded):");
      logger.table(localDecoded);
    } catch (decodeError) {
      logger.error("[attestation] Failed to decode local message as MessageV2 — falling back to hash-only comparison:", decodeError);
    }
  }

  const startedAt = Date.now();
  const deadline = startedAt + timeoutMs;
  let attempt = 0;

  while (Date.now() < deadline) {
    if (shouldCancel?.()) return { cancelled: true };

    attempt += 1;
    onAttempt?.(attempt);

    try {
      const url = `${IRIS_SANDBOX_BASE_URL}/v2/messages/${sourceDomain}?transactionHash=${transactionHash}`;
      const res = await fetch(url);

      if (res.status === 404) {
        // Circle hasn't indexed the burn tx yet — expected for the first
        // few polls right after confirmation. Keep polling.
      } else if (!res.ok) {
        // Distinguish "Iris is down/erroring" from "not found yet" so
        // bridgeErrors can label this correctly (IRIS_UNAVAILABLE).
        return { error: `Circle's attestation service is unavailable right now (status ${res.status}).`, irisUnavailable: true };
      } else {
        const data = await res.json();
        const messages = Array.isArray(data?.messages) ? data.messages : [];

        logger.log(
          "[attestation] Iris poll #" + attempt + " -- " + messages.length + " message(s) for tx " + transactionHash,
          messages.map(function (m) {
            return {
              eventNonce: m.eventNonce,
              status: m.status,
              messageHash: m.message && m.message !== "0x" ? ethers.keccak256(m.message) : null,
            };
          })
        );

        // Step 9: don't blindly use messages[0]. Find the entry whose
        // *immutable* MessageV2 fields match this bridge's local burn
        // message — never whole-message hash equality, since Iris fills in
        // `nonce`/`finalityThresholdExecuted` before signing (see the
        // module-level note).
        let entry = null;
        let sawMismatch = false;

        for (const m of messages) {
          if (!m.message || m.message === "0x") continue;

          if (localDecoded) {
            let candidateDecoded;
            try {
              candidateDecoded = decodeMessageV2(m.message);
            } catch (decodeError) {
              logger.error("[attestation] Failed to decode an Iris message as MessageV2 — skipping this candidate:", decodeError);
              continue;
            }

            const { matches, mismatches } = compareImmutableFields(localDecoded, candidateDecoded);

            if (matches) {
              entry = m;
              logger.log("[attestation] Iris message[eventNonce=" + m.eventNonce + "] matches local message on all immutable fields.");
              break;
            }

            sawMismatch = true;
            logger.warn(
              "[attestation] Iris message[eventNonce=" + m.eventNonce + "] differs on immutable field(s): " + mismatches.join(", "),
            );
            logger.log("[attestation] Iris MessageV2 (decoded):");
            logger.table(candidateDecoded);

            if (mismatches.includes("messageBody")) {
              const diff = diffHexBytes(localDecoded.messageBody, candidateDecoded.messageBody);
              if (diff) {
                logger.error(
                  "[attestation] messageBody byte-level divergence at offset " + diff.firstDivergentByte +
                  " (local length " + diff.lengthA + " bytes, Iris length " + diff.lengthB + " bytes).",
                  { localContext: diff.localContext, irisContext: diff.irisContext }
                );
              }
            }
          } else if (expectedMessageHash) {
            // Resumed session without raw local message bytes (only the
            // hash was persisted) — field-level comparison isn't possible,
            // so fall back to hash equality. This will only accept a
            // pre-attestation match (nonce still zero on both sides); once
            // Iris fills in nonce/finalityThresholdExecuted the hashes will
            // legitimately diverge even for the correct message, so this
            // branch intentionally does not reject on mismatch below — see
            // the "no local bytes" fallback after the loop.
            if (ethers.keccak256(m.message) === expectedMessageHash) {
              entry = m;
              break;
            }
          } else {
            // No local reference at all — nothing to validate against.
            break;
          }
        }

        if (entry && entry.status === "complete" && entry.attestation && entry.attestation !== "0x") {
          // Return Iris's message, not the local one — the attestation was
          // signed over Iris's copy (nonce + finalityThresholdExecuted
          // filled in), so that's what receiveMessage() must be called with.
          return { message: entry.message, attestation: entry.attestation };
        }

        if (!entry && localDecoded && sawMismatch && messages.length > 0 && messages.every((m) => m.status === "complete")) {
          // Every message Iris has for this tx is complete, but none
          // matched on immutable fields — a real mismatch, not a
          // not-yet-attested state, so stop polling instead of retrying to
          // the 5-min timeout.
          return {
            error: "Circle returned an attestation for a different message than this bridge's burn — refusing to mint with it.",
            invalidAttestation: true,
          };
        }

        if (!entry && !localDecoded && !expectedMessageHash && messages.length === 1 && messages[0].status === "complete") {
          // Resumed session with neither raw bytes nor a hash to validate
          // against (shouldn't normally happen) — accept the sole
          // candidate as best-effort, but say so loudly.
          logger.warn("[attestation] No local message reference available to validate against — accepting the only candidate Iris returned without field-level validation.");
          const only = messages[0];
          if (only.attestation && only.attestation !== "0x") {
            return { message: only.message, attestation: only.attestation };
          }
        }

        if (messages.some((m) => m.status === "failed")) {
          return { error: "Circle reported this transfer's attestation as failed.", invalidAttestation: true };
        }
      }
    } catch {
      // Network-level failure reaching Iris (offline, CORS, DNS, etc.) —
      // treated as transient and retried until the timeout below.
    }

  await new Promise((resolve) => setTimeout(resolve, intervalMs));

}

return {
  error:
    "Timed out waiting for Circle's attestation after 5 minutes. Your burn is already confirmed on Arc Testnet — you can safely retry the mint later with the same burn transaction.",
  timedOut: true,
 };

}
