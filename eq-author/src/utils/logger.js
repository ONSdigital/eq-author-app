/* eslint-disable import/unambiguous */

let logger;

switch (process.env.NODE_ENV) {
  case "development": {
    logger = require("pino")({
      prettyPrint: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "dd/mm/yyyy h:MM:ss",
      },
    });
    break;
  }
  default: {
    logger = require("pino")();
  }
}

module.exports = {
  logger,
};
