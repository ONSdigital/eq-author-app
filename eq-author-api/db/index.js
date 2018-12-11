const pinoMiddleware = require("express-pino-logger");
const pino = pinoMiddleware();
const logger = pino.logger;

const config = require("../config/knexfile.js");

const getConfig = async function(secretId) {
  const result = {
    ...config
  };
  logger.info("Getting DB Credentials");
  if (secretId && secretId !== "") {
    logger.info("Getting DB Credentials from AWS Secrets Manager");
    const AWS = require("aws-sdk");
    const client = new AWS.SecretsManager({ region: "eu-west-1" });
    try {
      const secret = await client
        .getSecretValue({ SecretId: secretId })
        .promise();
      const dbCredentials = JSON.parse(secret.SecretString);
      const { username, dbname, ...otherProps } = dbCredentials;

      result.connection = {
        user: username,
        database: dbname,
        ...otherProps
      };
    } catch (error) {
      logger.error(error);
      process.exit(1);
    }
  }
  return result;
};

module.exports = getConfig;
