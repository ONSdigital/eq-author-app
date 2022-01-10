const { flatMap, compact } = require("lodash");
const {
  ERR_SEC_CONDITION_NOT_SELECTED,
  ERR_COUNT_OF_GREATER_THAN_OPTIONS,
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
          isValid.errors = [
            createValidationError(
              instancePath,
              "secondaryCondition",
              ERR_SEC_CONDITION_NOT_SELECTED,
              questionnaire
            ),
          ];

          return false;
        }

        const getAllAnswers = (questionnaire) =>
          flatMap(questionnaire.sections, (section) =>
            flatMap(section.folders, (folder) =>
              compact(flatMap(folder.pages, (page) => page.answers))
            )
          );

        const allAnswers = getAllAnswers(questionnaire);
        const leftAnswer = allAnswers.find(
          ({ id }) => id === currentExpression.left.answerId
        );
        const leftAnswerOptions = leftAnswer.options;

        console.log(`leftAnswerOptions`, leftAnswerOptions);
        console.log(
          `currentExpression.right?.customValue`,
          currentExpression.right?.customValue
        );

        if (
          currentExpression.right?.customValue.number > leftAnswerOptions.length
        ) {
          isValid.errors = [
            createValidationError(
              instancePath,
              "secondaryCondition",
              ERR_COUNT_OF_GREATER_THAN_OPTIONS,
              questionnaire
            ),
          ];

          return false;
        }
        return true;
      }

      return true;
    },
  });
