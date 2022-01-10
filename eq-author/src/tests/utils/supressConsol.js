import PropTypes from "prop-types";

/*
 * @description Suppresses specific messages from being logged in the Console.
 *
 * Certain dependencies are using depreciated code and throwing warnings in the tests
 * Since they currently can't be updated due to issues updating node
 * this error suppression can be used to reduce test noise
 * ONLY USE UNTIL node can be updated above ver 10 and then the offending dependencies can also be updated
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
  // eslint-disable-next-line no-console
  console[method] = (nativeMessage) => {
    /* fire events that update state */
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
