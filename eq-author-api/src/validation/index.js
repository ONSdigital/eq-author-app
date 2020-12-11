const Ajv = require("ajv");
const createValidationError = require("./createValidationError");

const schemas = require("./schemas");

const ajv = new Ajv({ allErrors: true, jsonPointers: true, $data: true });

require("ajv-errors")(ajv);
require("./customKeywords")(ajv);
require("ajv-keywords")(ajv, "select");

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

module.exports = questionnaire => {
  validate(questionnaire);

  if (!validate.errors) {
    return [];
  }

  const errorMessages = validate.errors.filter(
    err => err.keyword === "errorMessage"
  );

  const uniqueErrorMessages = {};

  for (const err of errorMessages) {
    if (err.keyword !== "errorMessage") {
      continue;
    }
    const key = JSON.stringify(err);
    if (!uniqueErrorMessages[key]) {
      uniqueErrorMessages[key] = err;
    }
  }

  const formattedErrorMessages = Object.values(uniqueErrorMessages).map(
    error => {
      if (error.sectionId) {
        delete error.dataPath;
        delete error.schemaPath;
        delete error.keyword;

        return error;
      }

      const { dataPath, message } = error;

      const splitDataPath = dataPath.split("/");
      const field =
        message === "ERR_QCODE_REQUIRED"
          ? "qCode"
          : message === "ERR_SECONDARY_QCODE_REQUIRED"
          ? "secondaryQCode"
          : splitDataPath.pop();

      const newErrorMessage = createValidationError(
        splitDataPath,
        field,
        message,
        questionnaire
      );

      delete newErrorMessage.keyword;
      return newErrorMessage;
    }
  );

  return formattedErrorMessages;
};
