const { parse } = require("pg-connection-string");
const waitForPostgres = require("wait-for-postgres");

const { user, ...rest } = parse(process.env.DB_CONNECTION_URI);

waitForPostgres.await({
  username: user,
  ...rest
});
