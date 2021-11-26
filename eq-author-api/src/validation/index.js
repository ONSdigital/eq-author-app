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
  if (error.sectionId) {
    delete error.dataPath;
    delete error.schemaPath;
    delete error.keyword;

    return error;
  }

  // console.log(`error - - - `, error);

  const { instancePath, message } = error;

  const splitPath = instancePath.split("/");
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

  // console.log(`validate.errors`, validate.errors);

  const uniqueErrorMessages = {};
  const formattedErrorMessages = [];

  for (const err of validate.errors) {
    if (err.keyword === "errorMessage") {
      const key = `${err.instancePath} ${err.message}`;

      if (uniqueErrorMessages[key]) {
        continue;
      }
      uniqueErrorMessages[key] = err;

      formattedErrorMessages.push(formatErrorMessage(err, questionnaire));
    }
  }

  // console.log(`formattedErrorMessages`, formattedErrorMessages);

  return formattedErrorMessages;
};
