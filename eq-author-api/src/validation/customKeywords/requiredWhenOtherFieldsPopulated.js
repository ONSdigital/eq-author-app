const {
  ERR_VALID_REQUIRED,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

module.exports = function (ajv) {
  ajv.addKeyword("requiredWhenOtherFieldsPopulated", {
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      isValid.errors = [];

      const otherFieldsPopulated = otherFields.filter((field) => {
        return parentData[field];
      });

      if (!entityData && otherFieldsPopulated.length) {
        const err = createValidationError(
          dataPath,
          fieldName,
          ERR_VALID_REQUIRED,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }

      return true;
    },
  });
};
