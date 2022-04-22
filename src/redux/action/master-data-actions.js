import { SET_WALLET_CONNECTED } from "./actionTypes";

export const setIsWalletConnected = (isWalletConnected) => ({
  type: SET_WALLET_CONNECTED,
  isWalletConnected,
});
