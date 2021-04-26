const noir = require("pino-noir");

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
    logger.level = "debug";
    break;
  }
  case "test": {
    logger = require("pino")({
      prettyPrint: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "dd/mm/yyyy h:MM:ss",
      },
    });
    logger.level = "warn";
    break;
  }
  default: {
    logger = require("pino")();
  }
}

const expressLogger = require("express-pino-logger")({
  logger,
  serializers: noir(["req.headers.authorization"], "[Redacted]"),
});

module.exports = {
  logger,
  expressLogger,
};
