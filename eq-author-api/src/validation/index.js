const Ajv = require("ajv");
const createValidationError = require("./createValidationError");

const schemas = require("./schemas");

const ajv = new Ajv({
  allErrors: true,
  $data: true,
});

require("./customKeywords")(ajv);
require("ajv-keywords")(ajv, ["select", "uniqueItemProperties"]);
require("ajv-errors")(ajv);

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

const formatErrorMessage = (error, questionnaire) => {
  if (error.sectionId || error.listId) {
    delete error.dataPath;
    delete error.schemaPath;
    delete error.keyword;

    return error;
  }

  const { instancePath, message } = error;
  const splitPath = instancePath.split("/");

  if (!isNaN(splitPath[splitPath.length - 1])) {
    splitPath.push(error.params.errors[0].params.missingProperty);
  }

  const field = splitPath.pop();

  const newErrorMessage = createValidationError(
    splitPath,
    field,
    message,
    questionnaire
  );

  delete newErrorMessage.keyword;
  return newErrorMessage;
};

module.exports = (questionnaire) => {
  validate(questionnaire);

  if (!validate.errors) {
    return [];
  }

  const uniqueErrorMessages = {};
  const formattedErrorMessages = [];

  for (const err of validate.errors) {
    if (err.keyword === "errorMessage") {
      const key = `${err.instancePath} ${err.message} ${err.field}`;

      if (uniqueErrorMessages[key]) {
        continue;
      }
      uniqueErrorMessages[key] = err;

      formattedErrorMessages.push(formatErrorMessage(err, questionnaire));
    }
  }

  return formattedErrorMessages;
};
