import React, {
  useState,
  useCallback,
  useContext,
  useImperativeHandle,
} from "react";
import PropTypes from "prop-types";

export const NetworkActivityContext = React.createContext();
export const NetworkActivityContextRef = React.createRef();

export const useNetworkActivityContext = () =>
  useContext(NetworkActivityContext);

export const NetworkActivityContextProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [apiErrorOccurred, setApiErrorOccurred] = useState(false);
  const [onlineStatus, setOnlineStatus] = useState(true);

  // TODO - add state for online / offline status

  const value = {
    activeRequests,
    setActiveRequests: useCallback((val) => setActiveRequests(val), [
      setActiveRequests,
    ]),
    apiErrorOccurred,
    setApiErrorOccurred: useCallback((val) => setApiErrorOccurred(val), [
      setApiErrorOccurred,
    ]),
    onlineStatus,
    setOnlineStatus: useCallback((val) => setOnlineStatus(val), [
      setOnlineStatus,
    ]),
  };

  // Allow use outside of the React tree (by Apollo network links)
  useImperativeHandle(NetworkActivityContextRef, () => value);

  return (
    <NetworkActivityContext.Provider value={value}>
      {children}
    </NetworkActivityContext.Provider>
  );
};

NetworkActivityContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
