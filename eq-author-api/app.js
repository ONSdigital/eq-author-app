/* eslint-disable no-console */
const express = require("express");
const { graphqlExpress, graphiqlExpress } = require("graphql-server-express");
const { addErrorLoggingToSchema } = require("graphql-tools");
const repositories = require("./repositories");
const colors = require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const schema = require("./schema");
const pinoMiddleware = require("express-pino-logger");
const { PORT } = require("./config/settings");
const createLogger = require("./utils/createLogger");
const status = require("./middleware/status");
const { getLaunchUrl } = require("./middleware/launch");
const importAction = require("./middleware/import");

const app = express();
const pino = pinoMiddleware();

const logger = createLogger(pino.logger);
addErrorLoggingToSchema(schema, logger);

const context = { repositories };

app.use(
  "/graphql",
  pino,
  cors(),
  bodyParser.json(),
  graphqlExpress({
    schema,
    context,
    formatError: logger.log
  })
);

app.get("/status", status);

app.get("/launch/:questionnaireId", getLaunchUrl(context));
if (process.env.NODE_ENV === "development") {
  app.post("/import", bodyParser.json({ limit: "50mb" }), importAction);
}

if (process.env.NODE_ENV === "development") {
  app.use(
    "/graphiql",
    pino,
    cors(),
    graphiqlExpress({ endpointURL: "/graphql" })
  );
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(colors.green("Listening on port"), PORT);
});
