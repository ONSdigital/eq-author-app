const express = require("express");
const { graphqlExpress } = require("graphql-server-express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pinoMiddleware = require("express-pino-logger");
const helmet = require("helmet");

const { PORT } = require("./settings");
const status = require("./middleware/status");
const { getLaunchUrl } = require("./middleware/launch");
const createAuthMiddleware = require("./middleware/auth");
const repositories = require("./repositories");
const modifiers = require("./modifiers");
const schema = require("./schema");

const noir = require("pino-noir");

const app = express();
const pino = pinoMiddleware({
  serializers: noir(["req.headers.authorization"], "[Redacted]"),
});
const logger = pino.logger;

const db = require("./db");

db(process.env.DB_SECRET_ID)
  .then(async conf => {
    let knex = require("knex")(conf);
    logger.info("Running Migrate");
    await knex.migrate.latest();
    logger.info("Ran Migrate");

    const repos = repositories(knex);
    const context = { repositories: repos, modifiers: modifiers(repos) };

    const authMiddleware = createAuthMiddleware(logger, context);

    app.use(
      "/graphql",
      helmet({
        referrerPolicy: {
          policy: "no-referrer",
        },
        frameguard: {
          action: "deny",
        },
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'none'"],
            fontSrc: ["'self'", "'https://fonts.gstatic.com'"],
            scriptSrc: [
              "'self'",
              "'https://www.googleapis.com/identitytoolkit/v3'",
            ],
          },
        },
      }),
      pino,
      cors(),
      authMiddleware,
      bodyParser.json(),
      graphqlExpress({
        schema,
        context,
      })
    );

    app.get("/status", status);

    app.get("/launch/:questionnaireId", getLaunchUrl(context));
    if (process.env.NODE_ENV === "development") {
      const importAction = require("./middleware/import");
      app.post("/import", bodyParser.json({ limit: "50mb" }), importAction);
    }

    if (process.env.NODE_ENV === "development") {
      const { graphiqlExpress } = require("graphql-server-express");
      app.use(
        "/graphiql",
        pino,
        cors(),
        graphiqlExpress({ endpointURL: "/graphql" })
      );
    }

    app.listen(PORT, "0.0.0.0", () => {
      logger.child({ port: PORT }).info("Listening on port");
    });
  })
  .catch(error => {
    logger.info(error);
    process.exit(1);
  });
