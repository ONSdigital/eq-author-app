const { logger } = require("../../utils/logger");

const DEFAULT_DATABASE = "dynamodb";

const databaseName = process.env.DATABASE || DEFAULT_DATABASE;

if (!process.env.DATABASE) {
  logger.info(`Env var DATABASE not set; using default: ${DEFAULT_DATABASE}`);
} else {
  logger.info(`Using database: ${databaseName}`);
}

const datastore = require(`./datastore-${databaseName}`);

module.exports = datastore;
