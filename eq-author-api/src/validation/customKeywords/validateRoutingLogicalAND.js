const { groupBy } = require("lodash");
const createValidationError = require("../createValidationError");
const { ERR_LOGICAL_AND } = require("../../../constants/validationErrorCodes");

module.exports = ajv => {
  ajv.addKeyword("validateRoutingLogicalAND", {
    validate: function isValid(
      otherFields,
      { expressions },
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      const error = () => {
        isValid.errors = [
          createValidationError(
            dataPath,
            fieldName,
            ERR_LOGICAL_AND,
            questionnaire
          ),
        ];
        return false;
      };

      const expressionsByAnswerId = groupBy(expressions, "left.answerId");
      const potentialConflicts = Object.entries(expressionsByAnswerId).filter(
        ([_, expressions]) => expressions.length > 1
      );

      for (const [answerId, expressions] of potentialConflicts) {
        // Possible conditions: Equal, Unanswered, NotEqual, GreaterThan, LessThan, GreaterOrEqual, LessOrEqual

        // Handle "Unanswered" combinations first
        const conditions = expressions.map(e => e.condition);
        const areUnanswered = condition => condition === "Unanswered";
        if (
          conditions.some(areUnanswered) &&
          !conditions.every(areUnanswered)
        ) {
          console.log("VALIDATION ERROR: UNANSWERED CONFLICT");
          return error();
        }
      }

      return true;
    },
  });
};
