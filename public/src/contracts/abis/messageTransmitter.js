// MessageTransmitterV2 — CCTP V2's generic message-passing contract.
// Same contract handles both ends: `sendMessage` (called internally by
// TokenMessengerV2.depositForBurn on the source chain, which is where the
// `MessageSent` event below comes from) and `receiveMessage` (called by
// this app on the destination chain to complete a mint). See
// bridgeContracts.js for why the same address works on every EVM chain.

export const MESSAGE_TRANSMITTER_ABI = [
  "function receiveMessage(bytes message, bytes attestation) external returns (bool)",

  "event MessageSent(bytes message)",
];
