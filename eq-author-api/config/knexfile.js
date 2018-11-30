module.exports = {
  client: "postgresql",
  connection: process.env.DB_CONNECTION_URI,
  pool: {
    min: 10,
    max: 50
  },
  migrations: {
    tableName: "knex_migrations"
  }
};
