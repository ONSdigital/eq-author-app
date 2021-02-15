const {
  ERR_MAX_LENGTH_TOO_LARGE,
  ERR_MAX_LENGTH_TOO_SMALL,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

module.exports = function (ajv) {
  ajv.addKeyword("textLengthInRange", {
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

      if (entityData > 2000) {
        const err = createValidationError(
          dataPath,
          fieldName,
          ERR_MAX_LENGTH_TOO_LARGE,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }

      if (entityData < 10) {
        const err = createValidationError(
          dataPath,
          fieldName,
          ERR_MAX_LENGTH_TOO_SMALL,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }

      return true;
    },
  });
};
