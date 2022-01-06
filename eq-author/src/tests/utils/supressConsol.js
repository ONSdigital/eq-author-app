// import React from "react";
import PropTypes from "prop-types";
/*
 * @description Suppresses specific messages from being logged in the Console.
 *
 * A dependency (I think Redux) is throwing an error because it's using useLayoutEffect oon the server side and this is throwing an over sensitive warning
 * see - https://gist.github.com/gaearon/e7d97cdf38a2907924ea12e4ebdf3c85
 *
 * @param {string} message - The target message to suppress, either full text, partial text or a regular expression pattern and case-insensitive.
 * @param {string} method - The Console method of the message to suppress, including "error", "info", "log" and "warn".
 * @public
 * @function
 *
 * @example
 *
 *      suppressConsoleMessage("overeager alarm system", "error");
 *
 *      console.error("An alarm system for a nuclear power plant")  // <-- Logged
 *      console.error("An overeager alarm system for React")        // <-- Not Logged
 *      console.log("An overeager alarm system for React")          // <-- Logged
 *
 */
const suppressConsoleMessage = (message, method) => {
  const nativeConsoleMethod = console[method]; // eslint-disable-line
  console[method] = (nativeMessage) => {
    // eslint-disable-line
    if (!RegExp(message, "gi").test(nativeMessage)) {
      nativeConsoleMethod(nativeMessage);
    }
  };
};

suppressConsoleMessage.propTypes = {
  message: PropTypes.string,
  method: PropTypes.string,
};

export default suppressConsoleMessage;
