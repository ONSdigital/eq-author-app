const config = require("../config/knexfile.js");
const logger = createLogger(pino.logger);

const getConfig = async function(secretId) {
  if (secretId && secretId !== "") {
    const AWS = require("aws-sdk");
    const client = new AWS.SecretsManager({ region: "eu-west-1" });

    let secretPromise = client.getSecretValue({ SecretId: secretId }).promise();

    try {
      let secret = await secretPromise;
      let dbCredentials = JSON.parse(secret.SecretString);
      config.connection = {
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
  return config;
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
