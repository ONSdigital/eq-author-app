const createValidationError = require("../createValidationError");

module.exports = function (ajv) {
  ajv.addKeyword("uniquePropertyValueInArrayOfObjects", {
    validate: function uniqueLabelFn(
      propertyName,
      entityData,
      currentDataPath,
      parentDataPath,
      parentData,
      ___,
      questionnaire
    ) {
      uniqueLabelFn.errors = [];

      const entityValue = entityData[propertyName];
      if (!entityValue) {
        return true;
      }

      const entitiesWithSameValue = parentData.filter(
        (d) => d[propertyName] === entityValue
      );

      if (entitiesWithSameValue.length <= 1) {
        return true;
      }

      const err = createValidationError(
        parentDataPath,
        propertyName,
        "ERR_UNIQUE_REQUIRED",
        questionnaire
      );

      uniqueLabelFn.errors.push(err);

      return false;
    },
    $data: true,
    errors: true,
  });

  return ajv;
};
