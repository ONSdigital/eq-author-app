import React, { createContext, useState, useContext } from "react";
import PropType from "prop-types";

const PasteModalContext = createContext();
PasteModalContext.displayName = "PasteModalContext";

const PasteModalContextProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const value = { setIsVisible };

  return (
    <PasteModalContext.Provider value={value}>
      <PasteModalContext.Component isVisible={isVisible} />
      {children}
    </PasteModalContext.Provider>
  );
};

function usePasteModalContext() {
  const context = useContext(PasteModalContext);
  // if context is undefined this means it was used outside of its provider
  // you can throw an error telling that to your fellow developers
  if (!context) {
    throw new Error(
      "usePasteModalContext must be used under <PasteModalContextProvider/>"
    );
  }
  return context;
}

PasteModalContextProvider.propTypes = {
  children: PropType.node,
};

export { PasteModalContextProvider, usePasteModalContext };
