module.exports = {
  client: "postgresql",
  connection: {
    connection: process.env.DB_CONNECTION_URI
  },
  acquireConnectionTimeout: 5000
};
