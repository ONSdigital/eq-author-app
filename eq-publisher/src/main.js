const express = require("express");
const pino = require("express-pino-logger");
const { isNil } = require("lodash");
const helmet = require("helmet");

const errorHandler = require("./middleware/errorHandler");
const fetchData = require("./middleware/fetchData");
const schemaConverter = require("./middleware/schemaConverter");
const respondWithData = require("./middleware/respondWithData");
const status = require("./middleware/status");
const noContent = require("./middleware/nocontent");
const createAuthToken = require("./middleware/createAuthToken");

const Convert = require("./process/Convert");
const SchemaValidator = require("./validation/SchemaValidator");
const ValidationApi = require("./validation/ValidationApi");
const getQuestionnaire = require("./getQuestionnaire");

if (isNil(process.env.EQ_SCHEMA_VALIDATOR_URL)) {
  throw Error("EQ_SCHEMA_VALIDATOR_URL not specified");
}

if (isNil(process.env.EQ_AUTHOR_API_URL)) {
  throw Error("EQ_AUTHOR_API_URL not specified");
}

const converter = new Convert(
  new SchemaValidator(new ValidationApi(process.env.EQ_SCHEMA_VALIDATOR_URL))
);

const logger = pino();
const app = express();

app.use(
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
      },
    },
  })
);

app.get(
  "/graphql/:questionnaireId",
  logger,
  createAuthToken,
  fetchData(getQuestionnaire(process.env.EQ_AUTHOR_API_URL)),
  respondWithData
);

app.get(
  "/publish/:questionnaireId",
  logger,
  createAuthToken,
  fetchData(getQuestionnaire(process.env.EQ_AUTHOR_API_URL)),
  schemaConverter(converter),
  respondWithData
);

app.get("/status", status);
app.get("/favicon.ico", noContent);

app.use(errorHandler);

const PORT = process.env.PORT || 9000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Listening on port", PORT); // eslint-disable-line
});
