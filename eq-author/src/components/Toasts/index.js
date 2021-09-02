import React, { createContext, useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import ToastContainer from "./ToastContainer";

let id = 0;

const ToastContext = createContext({
  showToast: () => {},
});

const Toasts = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const handleDismissToast = (idToRemove) => {
    setToasts(toasts.filter(({ id }) => id !== idToRemove));
  };
  return (
    <ToastContext.Provider
      value={{
        showToast: (message) => setToasts([...toasts, { message, id: ++id }]),
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
