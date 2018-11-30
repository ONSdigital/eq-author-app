const config = require("../config/knexfile.js");
const createLogger = require("../utils/createLogger");
const pinoMiddleware = require("express-pino-logger");
const pino = pinoMiddleware();
const logger = createLogger(pino.logger);

const getConfig = async function(secretId) {
  const result = {
    ...config
  };

  if (secretId && secretId !== "") {
    const AWS = require("aws-sdk");
    const client = new AWS.SecretsManager({ region: "eu-west-1" });

    try {
      const secret = await client
        .getSecretValue({ SecretId: secretId })
        .promise();
      const dbCredentials = JSON.parse(secret.SecretString);
      result.connection = {
        host: dbCredentials.host,
        port: dbCredentials.port,
        user: dbCredentials.username,
        password: dbCredentials.password,
        database: dbCredentials.dbname
      };
      return config;
    } catch (error) {
      logger.error(error);
      process.exit();
    }
  }
  return result;
};

let connection;

function getConnection() {
  if (!connection) {
    getConfig(process.env.DB_SECRET_ID).then(conf => {
      connection = require("knex")(conf);
    });
  }
  return connection;
}

getConnection();

module.exports = {
  getConnection
};
