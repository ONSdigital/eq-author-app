import React, { createContext, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import ToastContainer from "./ToastContainer";

let id = 0;

export const ToastContext = createContext({
  showToast: () => {},
});

const Toasts = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const handleDismissToast = (idToRemove) => {
    setToasts((prevToasts) => prevToasts.filter(({ id }) => id !== idToRemove));
  };
  const handleAddToast = (message) => {
    setToasts((prevToasts) => [...prevToasts, { message, id: ++id }]);
  };
  return (
    <ToastContext.Provider
      value={{
        showToast: (message) => handleAddToast(message),
      }}
    >
      {children}
      {ReactDOM.createPortal(
        <ToastContainer toasts={toasts} onDismissToast={handleDismissToast} />,
        document.getElementById("toast")
      )}
    </ToastContext.Provider>
  );
};

Toasts.propTypes = {
  children: PropTypes.node.isRequired,
};

export const withShowToast = (Component) => {
  const WrappedComponent = (props) => (
    <ToastContext.Consumer>
      {({ showToast }) => <Component {...props} showToast={showToast} />}
    </ToastContext.Consumer>
  );

  WrappedComponent.displayName = `withShowToast(${Component.displayName})`;
  WrappedComponent.fragments = Component.fragments;

  return WrappedComponent;
};

export default Toasts;
