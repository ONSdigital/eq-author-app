const { logger } = require("../../utils/logger");

const DEFAULT_DATABASE = "mongodb";
const RETRY_TIME = "10000";
const databaseName = process.env.DATABASE || DEFAULT_DATABASE;

if (!process.env.DATABASE) {
  logger.debug(`Env var DATABASE not set; using default: ${DEFAULT_DATABASE}`);
} else {
  logger.debug(`Using database: ${databaseName}`);
}

const datastore = require(`./datastore-${databaseName}`);

const connectDB = async () => {
  try {
    await datastore.connectDB();
  } catch (error) {
    logger.error("Error connecting to datastore, retying...");
    setTimeout(connectDB, RETRY_TIME);
  }
};

if (datastore.connectDB) {
  connectDB();
}

module.exports = datastore;
