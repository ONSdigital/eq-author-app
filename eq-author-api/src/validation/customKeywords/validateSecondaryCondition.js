const {
  ERR_ANSWER_NOT_SELECTED,
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
            ERR_ANSWER_NOT_SELECTED,
            questionnaire
          );
          return false;
        }

        return true;
      }

      return true;
    },
  });
