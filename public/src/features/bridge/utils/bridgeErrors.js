/**
 * Bridge Error Definitions
 *
 * Centralizes all bridge-related error codes and user-friendly messages.
 */

export const BridgeErrorCode = {
  USER_REJECTED: "USER_REJECTED",

  NETWORK_SWITCH_FAILED: "NETWORK_SWITCH_FAILED",

  INSUFFICIENT_BALANCE: "INSUFFICIENT_BALANCE",

  INSUFFICIENT_GAS: "INSUFFICIENT_GAS",

  APPROVE_FAILED: "APPROVE_FAILED",

  BURN_FAILED: "BURN_FAILED",

  IRIS_TIMEOUT: "IRIS_TIMEOUT",

  IRIS_UNAVAILABLE: "IRIS_UNAVAILABLE",

  INVALID_ATTESTATION: "INVALID_ATTESTATION",

  RECEIVE_FAILED: "RECEIVE_FAILED",

  MINT_FAILED: "MINT_FAILED",

  UNKNOWN: "UNKNOWN",
};

export const BridgeErrorMessages = {
  USER_REJECTED:
    "Transaction was cancelled by the user.",

  NETWORK_SWITCH_FAILED:
    "Please switch to the required network and try again.",

  INSUFFICIENT_BALANCE:
    "Insufficient token balance.",

  INSUFFICIENT_GAS:
    "Insufficient native token for gas fees.",

  APPROVE_FAILED:
    "Token approval failed.",

  BURN_FAILED:
    "Bridge burn transaction failed.",

  IRIS_TIMEOUT:
    "Timed out waiting for Circle attestation. Your burn succeeded and can be completed later.",

  IRIS_UNAVAILABLE:
    "Circle attestation service is temporarily unavailable.",

  INVALID_ATTESTATION:
    "Attestation validation failed.",

  RECEIVE_FAILED:
    "Destination chain rejected the message.",

  MINT_FAILED:
    "Mint transaction failed on the destination chain.",

  UNKNOWN:
    "An unexpected error occurred.",
};

export function parseBridgeError(error) {
  if (!error) {
    return {
      code: BridgeErrorCode.UNKNOWN,
      message: BridgeErrorMessages.UNKNOWN,
    };
  }

  // User rejected transaction
  if (error.code === 4001) {
    return {
      code: BridgeErrorCode.USER_REJECTED,
      message: BridgeErrorMessages.USER_REJECTED,
    };
  }

  // Wallet request already pending
  if (error.code === -32002) {
    return {
      code: BridgeErrorCode.USER_REJECTED,
      message: "Wallet request already pending.",
    };
  }

  const message = error.message?.toLowerCase() || "";

  if (message.includes("insufficient funds")) {
    return {
      code: BridgeErrorCode.INSUFFICIENT_GAS,
      message: BridgeErrorMessages.INSUFFICIENT_GAS,
    };
  }

  if (
    message.includes("transfer amount exceeds balance") ||
    message.includes("erc20") ||
    message.includes("insufficient balance")
  ) {
    return {
      code: BridgeErrorCode.INSUFFICIENT_BALANCE,
      message: BridgeErrorMessages.INSUFFICIENT_BALANCE,
    };
  }

  if (message.includes("switch")) {
    return {
      code: BridgeErrorCode.NETWORK_SWITCH_FAILED,
      message: BridgeErrorMessages.NETWORK_SWITCH_FAILED,
    };
  }

  if (message.includes("attestation")) {
    return {
      code: BridgeErrorCode.INVALID_ATTESTATION,
      message: BridgeErrorMessages.INVALID_ATTESTATION,
    };
  }

  if (message.includes("receive")) {
    return {
      code: BridgeErrorCode.RECEIVE_FAILED,
      message: BridgeErrorMessages.RECEIVE_FAILED,
    };
  }

  if (message.includes("mint")) {
    return {
      code: BridgeErrorCode.MINT_FAILED,
      message: BridgeErrorMessages.MINT_FAILED,
    };
  }

  return {
    code: BridgeErrorCode.UNKNOWN,
    message: error.message || BridgeErrorMessages.UNKNOWN,
  };
}