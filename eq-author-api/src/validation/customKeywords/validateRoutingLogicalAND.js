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

const conditionIs = value => expression => expression.condition === value;
const getRHS = e =>
  e.right && e.right.customValue && e.right.customValue.number;

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
        ([, expressions]) => expressions.length > 1
      );

      for (const [answerId, expressions] of potentialConflicts) {
        // Possible conditions: Equal, Unanswered, NotEqual, GreaterThan, LessThan, GreaterOrEqual, LessOrEqual

        // Handle invalid combination of "Unanswered" with any answer-requiring condition
        if (
          expressions.some(conditionIs("Unanswered")) &&
          !expressions.every(conditionIs("Unanswered"))
        ) {
          console.log("VALIDATION ERROR: UNANSWERED CONFLICT");
          return error();
        }

        // Bail out if answer isn't numerical - remaining code validates number-type answers
        const answer = getAnswerById({ questionnaire }, answerId);
        if (![CURRENCY, NUMBER, UNIT, PERCENTAGE].includes(answer.type)) {
          continue;
        }

        // Multiple "equal" values are only logically consistent if set to the same value
        const equalityExpressions = expressions.filter(conditionIs("Equal"));
        const equalitySet = new Set(equalityExpressions.map(getRHS));
        equalitySet.delete(null);

        if (equalitySet.size > 1) {
          console.log("VALIDATION ERROR: MULTIPLE INCOMPATIBLE EQUALS");
          return error();
        }

        // Check that "equal" and "non-equal" conditions don't intersect
        const nonequalityExpressions = expressions.filter(
          conditionIs("NotEqual")
        );
        const nonequalitySet = new Set(nonequalityExpressions.map(getRHS));
        nonequalitySet.delete(null);

        for (const n of equalitySet) {
          if (nonequalitySet.has(n)) {
            console.log("VALIDATION ERROR: NON-EQUAL CLASHES WITH EQUAL");
            return error();
          }
        }

        // Find out precision of numerical answer
        const precision = Math.pow(10, -answer.properties.decimals);

        // Calculate allowed range based on greater than / less than rules
        let lowerLimit = -Infinity;
        let upperLimit = Infinity;
        for (const expression of expressions) {
          let rhs = getRHS(expression);
          if (rhs === undefined || rhs === null) {
            continue;
          }

          switch (expression.condition) {
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

        console.log("lowerLimit: ", lowerLimit, "upperLimit: ", upperLimit);

        // Validate the range is logically consistent - has to have a width greater than zero
        const rangeWidth = upperLimit - lowerLimit - precision;
        if (rangeWidth < Number.EPSILON) {
          console.log("VALIDATION ERROR: NO VALUES IN RANGE BOUNDS");
          return error();
        }

        // Validate equals are all in range
        if (
          Array.from(equalitySet).some(
            equalityValue =>
              equalityValue <= lowerLimit || equalityValue >= upperLimit
          )
        ) {
          console.log("VALIDATION ERROR: EQUALITY IMPOSSIBLE - OUT OF RANGE");
          return error();
        }

        // TODO:  Validate non-equality conditions do not completely deplete range
      }

      return true;
    },
  });
};
