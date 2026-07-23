// Bridge Center — pending-session persistence for the post-burn half of a
// transfer.
//
// Scope is deliberately narrow: this only ever covers the window between
// "burn confirmed" and "mint confirmed" — approve()/depositForBurn()
// (bridgeService.js) are untouched and still run start-to-finish in one
// call, same as before. Once a burn is confirmed, funds are already gone
// from Arc Testnet, so if the tab reloads (a wallet-triggered network
// switch and a manual refresh look identical to this app) mid-attestation
// or mid-mint, this is what lets useBridge resume the *same* transfer
// instead of leaving it stranded or letting the user accidentally start a
// second one.
//
// Own storage key (`arc_bridge_pending_session`), separate from Wallet's
// `arc_activity`/`arc_agent_id` — Wallet's code and storage are untouched.

const STORAGE_KEY = "arc_bridge_pending_session";

/** How stale a persisted session can be before this app stops offering to resume it. */
const MAX_SESSION_AGE_MS = 60 * 60 * 1000; // 1 hour

export function savePendingBridgeSession(session) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...session, savedAt: Date.now() }));
  } catch {
    /* localStorage unavailable (private mode, quota, etc.) — resume just won't be offered */
  }
}

export function clearPendingBridgeSession() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* non-fatal */
  }
}

/** Returns the persisted session if one exists and isn't stale, else `null`. */
export function loadPendingBridgeSession() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session?.burnTx || !session?.messageHash) return null;
    if (Date.now() - (session.savedAt || 0) > MAX_SESSION_AGE_MS) {
      clearPendingBridgeSession();
      return null;
    }

    return session;
  } catch {
    return null;
  }
}
