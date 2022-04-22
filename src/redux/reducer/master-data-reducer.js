import { SET_WALLET_CONNECTED } from "../action/actionTypes";

const initialState = {
  isWalletConnected: false,
};

export default function masterDataReducer(state = initialState, action) {
  switch (action.type) {
    case SET_WALLET_CONNECTED:
      return {
        isWalletConnected: action?.isWalletConnected,
      };
    default:
      return state;
  }
}
