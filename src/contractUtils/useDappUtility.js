import { useContractFunction } from "@usedapp/core";
import { useEffect, useState } from "react";

//The hook returns an extra value "loading" which can be used to show loaders where the contract function is called.
export const useUtilContractFunction = (...args) => {
  const [loading, setLoading] = useState(false);
  const { send, state } = useContractFunction(...args);

  //connects to redux Transaction Error Queue. ref masterReducer

  //We also display error/success using react-toastify for hoverable notifications

  useEffect(() => {
    if (state) {
      let error = state?.errorMessage;
      "execution reverted: YOU ARE AWESOME".slice(19, 30);
      switch (state.status) {
        case "None":
          break;
        case "Mining":
          setLoading(true);
          break;
        case "Success":
          setLoading(false);
          break;
        case "Failed":
          setLoading(false);
          break;
        case "Exception":
          setLoading(false);
          break;
        default:
          break;
      }
    }
  }, [state]);

  return { send, state, loading };
};
