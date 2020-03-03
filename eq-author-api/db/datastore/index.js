const logger = require("pino")();

const DYNAMODB = "dynamodb";

const databaseName = process.env.DATABASE || DYNAMODB;
const datastore = require(`./datastore-${databaseName}`);

if (!process.env.DATABASE) {
  logger.info(`Env var DATABASE not set; using default value: ${DYNAMODB}`);
}

module.exports = datastore;
