const logger = require("pino")();

const DEFAULT_DATABASE = "dynamodb";

const databaseName = process.env.DATABASE || DEFAULT_DATABASE;
const datastore = require(`./datastore-${databaseName}`);

if (!process.env.DATABASE) {
  logger.info(
    `Env var DATABASE not set; using default value: ${DEFAULT_DATABASE}`
  );
}

module.exports = datastore;
