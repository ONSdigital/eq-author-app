const Ajv = require("ajv");
const schemas = require("./schemas");
const { get } = require("lodash");
const { ANSWERS } = require("../../constants/validationErrorTypes");

const ajv = new Ajv({ allErrors: true, jsonPointers: true, $data: true });
require("ajv-errors")(ajv);
require("./customKeywords/uniquePropertyValueInArrayOfObjects")(ajv);

const validate = ajv.addSchema(schemas.slice(1)).compile(schemas[0]);

const convertObjectType = objectType => {
  if (objectType === "additionalAnswer") {
    return ANSWERS;
  }

  return objectType;
};

module.exports = questionnaire => {
  const validationErrors = [];

  validate(questionnaire);

  if (validate.errors) {
    const errorMessages = validate.errors.filter(
      err => err.keyword === "errorMessage"
    );

    errorMessages.forEach(error => {
      const dataPath = error.dataPath.split("/");

      const fieldname = dataPath.pop();

      let objectType = dataPath[dataPath.length - 1];
      if (!isNaN(objectType)) {
        // Must be in array of object type so get object type
        // e.g. /sections/0/pages/0/answers/0/options/0/label
        objectType = dataPath[dataPath.length - 2];
      }

      const contextPath = dataPath.slice(1).join(".");

      const contextObj = get(questionnaire, contextPath);
      validationErrors.push({
        id: contextObj.id,
        type: convertObjectType(objectType),
        field: fieldname,
        errorCode: error.message,
      });
    });
  }

  return validationErrors;
};
