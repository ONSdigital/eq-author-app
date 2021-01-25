const Ajv = require("ajv");
const createValidationError = require("./createValidationError");

const schemas = require("./schemas");

const ajv = new Ajv({ allErrors: true, jsonPointers: true, $data: true });
require("./customKeywords")(ajv);
require("ajv-keywords")(ajv, "select");
require("ajv-errors")(ajv);
const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

const formatErrorMessage = (error, questionnaire) => {
  if (error.sectionId) {
    delete error.dataPath;
    delete error.schemaPath;
    delete error.keyword;

    return error;
  }

  const { dataPath, message } = error;

  const splitDataPath = dataPath.split("/");
  let field = "";

  switch (message) {
    case "ERR_QCODE_REQUIRED":
      field = "qCode";
      break;
    case "ERR_SECONDARY_QCODE_REQUIRED":
      field = "secondaryQCode";
      break;
    default:
      field = splitDataPath.pop();
  }

  const newErrorMessage = createValidationError(
    splitDataPath,
    field,
    message,
    questionnaire
  );

  delete newErrorMessage.keyword;
  return newErrorMessage;
};

module.exports = questionnaire => {
  validate(questionnaire);

  if (!validate.errors) {
    return [];
  }

  const uniqueErrorMessages = {};
  const formattedErrorMessages = [];

  for (const err of validate.errors) {
    if (err.keyword === "errorMessage") {
      const key = `${err.dataPath} ${err.message}`;

      if (uniqueErrorMessages[key]) {
        continue;
      }
      uniqueErrorMessages[key] = err;

      formattedErrorMessages.push(formatErrorMessage(err, questionnaire));
    }
  }

  return formattedErrorMessages;
};
