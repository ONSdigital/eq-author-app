const { groupBy } = require("lodash");
const {
  getAnswerById,
  getPageByAnswerId,
} = require("../../../schema/resolvers/utils");

const {
  CURRENCY,
  NUMBER,
  PERCENTAGE,
  UNIT,
  CHECKBOX,
  MUTUALLY_EXCLUSIVE,
} = require("../../../constants/answerTypes");
const createValidationError = require("../createValidationError");
const { ERR_LOGICAL_AND } = require("../../../constants/validationErrorCodes");

const areUnanswered = (e) => e.condition === "Unanswered";

module.exports = (ajv) => {
  ajv.addKeyword({
    keyword: "validateRoutingLogicalAND",
    validate: function isValid(
      _schema,
      { expressions },
      _parentSchema,
      { rootData: questionnaire, instancePath }
    ) {
      const allExpressions = expressions;
      const invalidAnswerIds = new Set();
      const expressionsByAnswerId = groupBy(expressions, "left.answerId");
      const potentialConflicts = Object.entries(expressionsByAnswerId).filter(
        ([answerId, expressions]) => answerId && expressions.length
      );

      const addError = (answerId) => invalidAnswerIds.add(answerId);

      potentialConflicts.forEach(([answerId, expressions]) => {
        // Handle invalid combination of "Unanswered" with any answer-requiring condition
        if (
          expressions.some(areUnanswered) &&
          !expressions.every(areUnanswered)
        ) {
          return addError(answerId);
        }

        const answer = getAnswerById({ questionnaire }, answerId);
        const page = getPageByAnswerId({ questionnaire }, answerId);
        const expressionsContainMutuallyExclusive = allExpressions.some(
          (expression) =>
            getAnswerById({ questionnaire }, expression.left.answerId)?.type ===
            MUTUALLY_EXCLUSIVE
        );
        const allExpressionAnswerIds = allExpressions.map(
          (expression) => expression.left.answerId
        );
        const pageIdsForExpressionAnswers = allExpressionAnswerIds.map(
          (answerId) => getPageByAnswerId({ questionnaire }, answerId)?.id
        );

        // Creates an array of all pageIds that are found in pageIdsForExpressionAnswers more than once - self represents the pageIdsForExpressionAnswers array itself
        // If the index of the looped id is not equal to the looping index then the id is a duplicate
        const duplicatePageIds = pageIdsForExpressionAnswers.filter(
          (id, index, self) => {
            return self.indexOf(id) !== index;
          }
        );

        // If any of the expressions contain a mutually exclusive answer and there are multiple answers from the same page
        if (
          expressionsContainMutuallyExclusive &&
          duplicatePageIds.length > 0
        ) {
          // Prevents the error being added to answers that are not on the same page as the mutually exclusive answer
          if (
            duplicatePageIds.includes(page.id) &&
            page.answers.some((answer) => answer.type === MUTUALLY_EXCLUSIVE)
          ) {
            return addError(answerId);
          }
        }

        // Bail out if answer isn't numerical or checkbox - remaining code validates number-type answers
        if (
          !answer ||
          ![CURRENCY, NUMBER, UNIT, PERCENTAGE, CHECKBOX].includes(answer.type)
        ) {
          return;
        }

        // Equality values and non-equality values are gathered into a sets since we only care about unique values
        const equalitySet = new Set();
        const nonequalitySet = new Set();

        // lowerLimit and upperLimit represent the calculated lower bound and upper bound respectively
        // of the values which an answer may take in order to activate the routing rule (non-inclusive)
        // i.e. a routing rule with > 40 and < 30
        // would have a lowerLimit of 30 (set by the 'less than' condition)
        // and an upperLimit of 40 (set by the 'greater than' condition)
        let lowerLimit = -Infinity;
        let upperLimit = Infinity;

        // Answer precision is 10^(-decimals) - e.g. an answer with decimals = 2 iwll have precision 0.01
        // (the smallest allowable value change in an answer)
        const precision = Math.pow(10, -answer?.properties?.decimals ?? 0);

        for (const expression of expressions) {
          let rightHandSide = expression?.right?.customValue?.number;
          if (rightHandSide === undefined || rightHandSide === null) {
            continue;
          }

          if (answer.type === CHECKBOX) {
            switch (expression.secondaryCondition) {
              case "Equal":
                equalitySet.add(rightHandSide);
                break;
              case "NotEqual":
                nonequalitySet.add(rightHandSide);
                break;
              case "LessOrEqual":
                rightHandSide += precision;
              // Fall through - less than or equal to n equiv. to less than n + precision
              case "LessThan":
                upperLimit = Math.min(upperLimit, rightHandSide);
                break;
              case "GreaterOrEqual":
                rightHandSide -= precision;
              // Fall through - greater than or equal to n equiv. to greater than n - precision
              case "GreaterThan":
                lowerLimit = Math.max(lowerLimit, rightHandSide);
                break;
            }
          } else {
            switch (expression.condition) {
              case "Equal":
                equalitySet.add(rightHandSide);
                break;
              case "NotEqual":
                nonequalitySet.add(rightHandSide);
                break;
              case "LessOrEqual":
                rightHandSide += precision;
              // Fall through - less than or equal to n equiv. to less than n + precision
              case "LessThan":
                upperLimit = Math.min(upperLimit, rightHandSide);
                break;
              case "GreaterOrEqual":
                rightHandSide -= precision;
              // Fall through - greater than or equal to n equiv. to greater than n - precision
              case "GreaterThan":
                lowerLimit = Math.max(lowerLimit, rightHandSide);
                break;
            }
          }
        }

        // Multiple "equal" values are only logically consistent if set to the same value
        if (equalitySet.size > 1) {
          return addError(answerId);
        }

        // Check that the sets of "equal" and "non-equal" values don't intersect
        for (const n of equalitySet) {
          if (nonequalitySet.has(n)) {
            return addError(answerId);
          }
        }

        // Validate the range is logically consistent - has to have a width greater than zero
        // Subtract answer precision as bounds are non-inclusive.
        const rangeWidth = upperLimit - lowerLimit - precision;
        if (rangeWidth < Number.EPSILON) {
          return addError(answerId);
        }

        // Validate equals are all contained within upper / lower bounds
        if ([...equalitySet].some((n) => n <= lowerLimit || n >= upperLimit)) {
          return addError(answerId);
        }

        // Validate non-equality conditions do not completely deplete range
        // If there are n non-equality conditions with unique values
        // in a range with only n possible values - then we know the condition cannot be met
        const possibleAnswers = rangeWidth / precision;
        if (
          [...nonequalitySet].filter(
            (nonequalityValue) =>
              nonequalityValue > lowerLimit && nonequalityValue < upperLimit
          ).length >= possibleAnswers
        ) {
          return addError(answerId);
        }
      });

      isValid.errors = [...invalidAnswerIds].map((answerId) =>
        createValidationError(
          instancePath,
          answerId,
          ERR_LOGICAL_AND,
          questionnaire
        )
      );

      return isValid.errors.length === 0;
    },
  });
};
