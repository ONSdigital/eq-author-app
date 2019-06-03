const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");
const pinoMiddleware = require("express-pino-logger");
// const helmet = require("helmet");
const noir = require("pino-noir");
const bodyParser = require("body-parser");
const http = require("http");
const jwt = require("jsonwebtoken");

const status = require("./middleware/status");
const { getLaunchUrl } = require("./middleware/launch");
const createAuthMiddleware = require("./middleware/auth");
const loadQuestionnaire = require("./middleware/loadQuestionnaire");
const runQuestionnaireMigrations = require("./middleware/runQuestionnaireMigrations");
const exportQuestionnaire = require("./middleware/export");
const importQuestionnaire = require("./middleware/import");
const validateQuestionnaire = require("./middleware/validateQuestionnaire");

const schema = require("./schema");

const { PORT = 4000 } = process.env;

const app = express();
const pino = pinoMiddleware({
  serializers: noir(["req.headers.authorization"], "[Redacted]"),
});
const logger = pino.logger;

app.use(
  "/graphql",
  // helmet({
  //   referrerPolicy: {
  //     policy: "no-referrer",
  //   },
  //   frameguard: {
  //     action: "deny",
  //   },
  //   contentSecurityPolicy: {
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       objectSrc: ["'none'"],
  //       baseUri: ["'none'"],
  //       fontSrc: ["'self'", "'https://fonts.gstatic.com'"],
  //       scriptSrc: [
  //         "'self'",
  //         "'https://www.googleapis.com/identitytoolkit/v3'",
  //       ],
  //     },
  //   },
  // }),
  pino,
  cors(),
  createAuthMiddleware(logger),
  loadQuestionnaire,
  runQuestionnaireMigrations(logger)(require("./migrations")),
  validateQuestionnaire
);

const server = new ApolloServer({
  ...schema,
  context: ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    }
    return {
      questionnaire: req.questionnaire,
      auth: req.auth,
      validationErrorInfo: req.validationErrorInfo,
    };
  },
  tracing: true,
  subscriptions: {
    onConnect: async (params, socket, ctx) => {
      if (!params.headers.authorization) {
        return false;
      }
      ctx.auth = jwt.decode(
        params.headers.authorization.replace("Bearer ", "")
      );
      return true;
    },
  },
});
server.applyMiddleware({ app });

app.get("/status", status);

app.get("/launch/:questionnaireId", getLaunchUrl);

app.get("/export/:questionnaireId", exportQuestionnaire);
if (process.env.ENABLE_IMPORT === "true") {
  app.use(bodyParser.json()).post("/import", importQuestionnaire);
}

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);
// eslint-disable-next-line
console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
// eslint-disable-next-line
console.log(
  `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
);

module.exports = httpServer;
