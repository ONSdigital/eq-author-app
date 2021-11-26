const {
  OPERATOR_REQUIRED,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateSecondaryCondition",
    schema: false,
    validate: function isValid(
      currentExpression,
      { rootData: questionnaire, instancePath }
    ) {
      if (currentExpression.condition === "CountOf") {
        if (
          currentExpression.secondaryCondition === null ||
          currentExpression.secondaryCondition === undefined
        ) {
          isValid.errors = createValidationError(
            instancePath,
            "secondaryCondition",
            OPERATOR_REQUIRED,
            questionnaire
          );
          return false;
        }

        return true;
      }

      return true;
    },
  });
