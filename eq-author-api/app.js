require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const bodyParser = require("body-parser");
const pinoMiddleware = require("express-pino-logger");
const helmet = require("helmet");

const status = require("./middleware/status");
const { getLaunchUrl } = require("./middleware/launch");
const createAuthMiddleware = require("./middleware/auth");
const loadQuestionnaire = require("./middleware/loadQuestionnaire");
const schema = require("./schema");

const noir = require("pino-noir");

const { PORT = 4000 } = process.env;
const app = express();
const pino = pinoMiddleware({
  serializers: noir(["req.headers.authorization"], "[Redacted]"),
});
const logger = pino.logger;

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
  createAuthMiddleware(logger),
  loadQuestionnaire
);

const server = new ApolloServer({
  ...schema,
  context: ({ req }) => {
    return { questionnaire: req.questionnaire, auth: req.auth };
  },
});
server.applyMiddleware({ app });

app.get("/status", status);

app.get("/launch/:questionnaireId", getLaunchUrl);
if (process.env.NODE_ENV === "development") {
  const importAction = require("./middleware/import");
  app.post("/import", bodyParser.json({ limit: "50mb" }), importAction);
}

app.listen(PORT, "0.0.0.0", () => {
  logger.child({ port: PORT }).info("Listening on port");
});
