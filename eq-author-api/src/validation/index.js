const Ajv = require("ajv");
const createValidationError = require("./createValidationError");
const { uniqWith, isEqual } = require("lodash");

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

  const errorMessagesWithQCodes = validate.errors.filter(
    err => (err.keyword === "errorMessage" && err.dataPath.includes('qCode'))
  );

  console.log('\nerrorMessagesWithQCodes', JSON.stringify(errorMessagesWithQCodes, null, 7))

  const formattedErrorMessages = errorMessages.map(error => {
    if (error.sectionId) {
      delete error.dataPath;
      delete error.schemaPath;
      delete error.keyword;

      return error;
    }

    const { dataPath, message } = error;

    const splitDataPath = dataPath.split("/");

    const newErrorMessage = createValidationError(
      splitDataPath,
      splitDataPath.pop(),
      message,
      questionnaire
    );

    delete newErrorMessage.keyword;
    return newErrorMessage;
  });

  const uniqeErrorMessages = uniqWith(formattedErrorMessages, (one, two) => {
    const oneClone = Object.assign({}, one);
    const twoClone = Object.assign({}, two);

    delete oneClone.id;
    delete twoClone.id;

    const isDuplicate = isEqual(oneClone, twoClone);

    return isDuplicate;
  });

  return uniqeErrorMessages;
};
