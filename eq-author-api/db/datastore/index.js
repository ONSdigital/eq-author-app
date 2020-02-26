const DYNAMODB = "dynamodb";

if (!process.env.DATABASE) {
  throw new Error("Unset env var 'DATABASE'");
}

const databaseName = process.env.DATABASE;

let datastore;

if (databaseName === DYNAMODB) {
  datastore = require("./datastore-dynamodb");
}

if (!datastore) {
  throw new Error(`Unknown DATABASE env value: ${databaseName}`);
}

module.exports = datastore;
