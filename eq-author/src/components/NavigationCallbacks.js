import React, { useState, useEffect, createContext, useContext } from "react";
import PropTypes from "prop-types";

const CallbackContext = createContext({ callbacks: null, setCallbacks: null });

export const CallbackContextProvider = ({ children }) => {
  const [callbacks, setCallbacks] = useState({
    onAddQuestionPage: () => {
      throw new Error("onAddQuestionPage callback not defined");
    },
    onAddCalculatedSummaryPage: () => {
      throw new Error("onAddCalculatedSummaryPage callback not defined");
    },
    onAddFolder: () => {
      throw new Error("onAddFolder callback not defined");
    },
  });

  return (
    <CallbackContext.Provider value={{ callbacks, setCallbacks }}>
      {children}
    </CallbackContext.Provider>
  );
};

CallbackContextProvider.propTypes = {
  children: PropTypes.node,
};

export const useNavigationCallbacks = () =>
  useContext(CallbackContext).callbacks;

export const useSetNavigationCallbacks = (callbacks, dependencies) => {
  const { setCallbacks } = useContext(CallbackContext);

  useEffect(
    () => dependencies.every((x) => x) && setCallbacks(callbacks),
    dependencies
  );
};
