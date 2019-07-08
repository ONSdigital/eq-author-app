const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const pinoMiddleware = require("express-pino-logger");
const helmet = require("helmet");
const noir = require("pino-noir");
const bodyParser = require("body-parser");

const status = require("./middleware/status");
const { getLaunchUrl } = require("./middleware/launch");
const loadQuestionnaire = require("./middleware/loadQuestionnaire");
const runQuestionnaireMigrations = require("./middleware/runQuestionnaireMigrations");
const exportQuestionnaire = require("./middleware/export");
const importQuestionnaire = require("./middleware/import");
const identificationMiddleware = require("./middleware/identification");
const upsertUser = require("./middleware/identification/upsertUser");
const rejectUnidentifiedUsers = require("./middleware/identification/rejectUnidentifiedUsers");
const validateQuestionnaire = require("./middleware/validateQuestionnaire");

const schema = require("./schema");

const createApp = () => {
  const app = express();
  const pino = pinoMiddleware({
    serializers: noir(["req.headers.authorization"], "[Redacted]"),
  });
  const logger = pino.logger;

  let extensions = [];
  if (process.env.ENABLE_OPENTRACING === "true") {
    const OpentracingExtension = require("apollo-opentracing").default;
    const { localTracer, serverTracer } = require("./tracer").tracer(logger);
    extensions = [
      () =>
        new OpentracingExtension({
          server: serverTracer,
          local: localTracer,
        }),
    ];
  }

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
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          styleSrc: [
            "'self'",
            "http://cdn.jsdelivr.net/npm/@apollographql/",
            "https://fonts.googleapis.com",
            // These will change with graphql server versions
            "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
            "'sha256-iRiwFogHwyIOlQ0vgwGxLZXMnuPZa9eZnswp4v8s6fE='",
            "'sha256-WYkrRZYpK8d/rqMjoMTIfcPzRxeojQUncPzhW9/2pg8='",
            "'sha256-jQoC6QpIonlMBPFbUGlJFRJFFWbbijMl7Z8XqWrb46o='",
          ],
          scriptSrc: [
            "'self'",
            "https://www.googleapis.com/identitytoolkit/v3",
            "http://cdn.jsdelivr.net/npm/@apollographql/",
            "'sha256-qQ+vMtTOJ7ZAi9QUiV74BIEp2+xQJt7uiJ47QICu6xI='",
          ],
          imgSrc: ["'self'", "http://cdn.jsdelivr.net/npm/@apollographql/"],
        },
      },
    }),
    pino,
    cors(),
    identificationMiddleware(logger),
    rejectUnidentifiedUsers,
    loadQuestionnaire,
    runQuestionnaireMigrations(logger)(require("./migrations")),
    validateQuestionnaire
  );

  const server = new ApolloServer({
    ...schema,
    context: ({ req }) => {
      return {
        questionnaire: req.questionnaire,
        user: req.user,
        validationErrorInfo: req.validationErrorInfo,
      };
    },
    extensions,
  });

  server.applyMiddleware({ app });

  app.get("/status", status);

  app.get("/launch/:questionnaireId", getLaunchUrl);

  app.get("/export/:questionnaireId", exportQuestionnaire);
  if (process.env.ENABLE_IMPORT === "true") {
    app
      .use(bodyParser.json())
      .post(
        "/import",
        identificationMiddleware(logger),
        rejectUnidentifiedUsers,
        importQuestionnaire
      );
  }

  app.post("/signIn", identificationMiddleware(logger), upsertUser);

  return app;
};

module.exports = {
  createApp,
};
