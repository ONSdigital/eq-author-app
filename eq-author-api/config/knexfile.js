module.exports = {
  client: "pg",
  connection: {
    connection: process.env.DB_CONNECTION_URI
  },
  acquireConnectionTimeout: 5000
};
