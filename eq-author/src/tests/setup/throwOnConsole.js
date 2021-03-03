/* eslint-disable import/unambiguous */
const { logger } = require("../../utils/logger");

const actualConsoleError = logger.error.bind(console);

logger.error = jest.fn(function (msg, ...rest) {
  actualConsoleError(msg, ...rest);
  throw msg instanceof Error ? msg : new Error(msg);
});
