const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const pinoMiddleware = require("express-pino-logger");
const helmet = require("helmet");
const noir = require("pino-noir");
const bodyParser = require("body-parser");

const status = require("./middleware/status");
const { getLaunchUrl } = require("./middleware/launch");
const createAuthMiddleware = require("./middleware/auth");
const loadQuestionnaire = require("./middleware/loadQuestionnaire");
const runQuestionnaireMigrations = require("./middleware/runQuestionnaireMigrations");
const exportQuestionnaire = require("./middleware/export");
const importQuestionnaire = require("./middleware/import");
const validateQuestionnaire = require("./middleware/validateQuestionnaire");

const schema = require("./schema");

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
  loadQuestionnaire,
  runQuestionnaireMigrations(logger)(require("./migrations")),
  validateQuestionnaire
);

const server = new ApolloServer({
  ...schema,
  context: ({ req }) => {
    return {
      questionnaire: req.questionnaire,
      auth: req.auth,
      validationErrorInfo: req.validationErrorInfo,
    };
  },
});
server.applyMiddleware({ app });

app.get("/status", status);

app.get("/launch/:questionnaireId", getLaunchUrl);

app.get("/export/:questionnaireId", exportQuestionnaire);
if (process.env.ENABLE_IMPORT === "true") {
  app.use(bodyParser.json()).post("/import", importQuestionnaire);
}

module.exports = app;
