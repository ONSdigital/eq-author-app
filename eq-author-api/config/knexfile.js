module.exports = {
  client: "postgresql",
  connection: process.env.DB_CONNECTION_URI,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: "knex_migrations"
  }
};
