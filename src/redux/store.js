import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { useDispatch as useReduxDispatch, useSelector as useReduxSelector } from "react-redux";
import thunk from "redux-thunk";

import masterDataReducer from "./reducer/master-data-reducer.js";

export const store = configureStore({
  reducer: combineReducers({
    masterDataReducer,
  }),
  devTools: true,
  middleware: [thunk],
});

export const useSelector = useReduxSelector;

export const useDispatch = () => useReduxDispatch();

export default store;
