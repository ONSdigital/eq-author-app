const {
  ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
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
      // console.log(
      //   `validateSecondaryCondition - currentExpression`,
      //   JSON.stringify(currentExpression, null, 7)
      // );

      if (currentExpression.condition === "CountOf") {
        console.log(`HERE >>>>>>>>>>>>`);

        if (
          currentExpression.secondaryCondition === null ||
          currentExpression.secondaryCondition === undefined
        ) {
          console.log(`HERE 22222222222!!!!!!!!!!!!!`);

          isValid.errors = createValidationError(
            instancePath,
            "secondaryCondition",
            ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
            questionnaire
          );
          return false;
        }

        return true;
      }

      return true;
    },
  });
