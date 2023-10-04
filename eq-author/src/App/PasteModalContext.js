import React, { createContext, useState, useContext } from "react";

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
