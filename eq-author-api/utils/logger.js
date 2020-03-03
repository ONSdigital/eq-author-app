const noir = require("pino-noir");

const logger = require("pino")({
  prettyPrint: { colorize: true },
});

const expressLogger = require("express-pino-logger")({
  logger,
  serializers: noir(["req.headers.authorization"], "[Redacted]"),
});

module.exports = {
  logger,
  expressLogger,
};
