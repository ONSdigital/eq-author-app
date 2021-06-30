const createValidationError = require("../createValidationError");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "uniquePropertyValueInArrayOfObjects",
    validate: function uniqueLabelFn(
      propertyName,
      data,
      _parentSchema,
      { rootData: questionnaire, parentData, instancePath }
    ) {
      const entityValue = data[propertyName];
      if (!entityValue) {
        return true;
      }

      const entitiesWithSameValue = parentData.filter(
        (d) => d[propertyName] === entityValue
      );

      if (entitiesWithSameValue.length <= 1) {
        return true;
      }

      uniqueLabelFn.errors = [
        createValidationError(
          instancePath,
          propertyName,
          "ERR_UNIQUE_REQUIRED",
          questionnaire
        ),
      ];

      return false;
    },
  });
