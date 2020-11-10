const { groupBy } = require("lodash");
const { getAnswerById } = require("../../../schema/resolvers/utils");
const {
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
} = require("../../../constants/answerTypes");
const createValidationError = require("../createValidationError");
const { ERR_LOGICAL_AND } = require("../../../constants/validationErrorCodes");

const getRHS = e =>
  e.right && e.right.customValue && e.right.customValue.number;

const areUnanswered = e => e.condition === "Unanswered";

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
      const invalidAnswerIds = new Set();
      const expressionsByAnswerId = groupBy(expressions, "left.answerId");
      const potentialConflicts = Object.entries(expressionsByAnswerId).filter(
        ([answerId, expressions]) =>
          expressions.length > 1 &&
          answerId &&
          answerId.length &&
          answerId.length > 0
      );

      const error = answerId => invalidAnswerIds.add(answerId);

      potentialConflicts.forEach(([answerId, expressions]) => {
        // Handle invalid combination of "Unanswered" with any answer-requiring condition
        if (
          expressions.some(areUnanswered) &&
          !expressions.every(areUnanswered)
        ) {
          return error(answerId);
        }

        // Bail out if answer isn't numerical - remaining code validates number-type answers
        const answer = getAnswerById({ questionnaire }, answerId);
        if (![CURRENCY, NUMBER, UNIT, PERCENTAGE].includes(answer.type)) {
          return;
        }

        // Calculate precision of numerical answer based on trailing decimal count
        const precision = Math.pow(10, -answer.properties.decimals);

        const equalitySet = new Set();
        const nonequalitySet = new Set();
        let lowerLimit = -Infinity;
        let upperLimit = Infinity;

        for (const expression of expressions) {
          let rhs = getRHS(expression);
          if (rhs === undefined || rhs === null) {
            continue;
          }

          switch (expression.condition) {
            case "Equal":
              equalitySet.add(rhs);
              break;
            case "NotEqual":
              nonequalitySet.add(rhs);
              break;
            case "LessOrEqual":
              rhs += precision;
            // Fall through - less than or equal equiv. to less than n + precision
            case "LessThan":
              upperLimit = Math.min(upperLimit, rhs);
              break;
            case "GreaterOrEqual":
              rhs -= precision;
            // Fall through - greater than or equal equiv. to greater than n - precision
            case "GreaterThan":
              lowerLimit = Math.max(lowerLimit, rhs);
              break;
          }
        }

        // Multiple "equal" values are only logically consistent if set to the same value
        if (equalitySet.size > 1) {
          return error(answerId);
        }

        // Check that "equal" and "non-equal" conditions don't intersect
        for (const n of equalitySet) {
          if (nonequalitySet.has(n)) {
            return error(answerId);
          }
        }

        // Validate the range is logically consistent - has to have a width greater than zero
        const rangeWidth = upperLimit - lowerLimit - precision;
        if (rangeWidth < Number.EPSILON) {
          return error(answerId);
        }

        // Validate equals are all in range
        if (
          Array.from(equalitySet).some(n => n <= lowerLimit || n >= upperLimit)
        ) {
          return error(answerId);
        }

        // Validate non-equality conditions do not completely deplete range
        const possibleAnswers = rangeWidth / precision;
        if (
          Array.from(nonequalitySet).filter(
            nonequalityValue =>
              nonequalityValue > lowerLimit && nonequalityValue < upperLimit
          ).length >= possibleAnswers
        ) {
          return error(answerId);
        }
      });

      isValid.errors = Array.from(invalidAnswerIds).map(answerId =>
        createValidationError(
          dataPath,
          answerId,
          ERR_LOGICAL_AND,
          questionnaire
        )
      );

      return isValid.errors.length === 0;
    },
  });
};
