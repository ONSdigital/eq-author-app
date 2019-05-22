const Ajv = require("ajv");
const schemas = require("./schemas");
const { get } = require("lodash");

const ajv = new Ajv({ allErrors: true, jsonPointers: false });
require("ajv-errors")(ajv /*, {singleError: true} */);

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

if (validate.errors) {
  throw new Error(validate.errors[0]);
}

module.exports = questionnaire => {
  const validationErrors = {};

  validate(questionnaire);

  if (validate.errors) {
    validate.errors.forEach(error => {
      const dataPath = error.dataPath.split("/");
      const fieldname = dataPath.pop();

      const objectType = dataPath[dataPath.length - 2];

      const contextPath = dataPath.slice(1).join(".");
      const contextObj = get(questionnaire, contextPath);

      const errorKey = `${objectType}_${contextObj.id}`;

      if (!validationErrors[errorKey]) {
        validationErrors[errorKey] = [];
      }
      validationErrors[errorKey].push({
        field: fieldname,
        errorCode: 4,
        errorMessage: error.message,
      });
    });
  }

  return validationErrors;
};
