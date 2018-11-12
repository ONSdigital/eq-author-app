module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.DB_CONNECTION_URI
  },

  test: {
    client: "postgresql",
    connection: process.env.DB_CONNECTION_URI
  },

  staging: {
    client: "postgresql",
    connection: process.env.DB_CONNECTION_URI,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: process.env.DB_CONNECTION_URI,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }
};
