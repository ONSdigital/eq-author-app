const {
  ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const {
  getOptionById,
  getExpressionGroupByExpressionId,
} = require("../../../schema/resolvers/utils");

// referencesAnswerId: string -> expression -> bool
// `true` if expression references specified `id`
// `false` otherwise
const referencesAnswerId =
  (id) =>
  ({ left }) =>
    left.type !== "Null" && left.answerId === id;

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateExpression",
    schema: false,
    validate: function isValid(
      currentExpression,
      { parentData: expressions, rootData: questionnaire, instancePath }
    ) {
      if (currentExpression.condition !== "AllOf") {
        return true;
      }

      const { operator } = getExpressionGroupByExpressionId(
        { questionnaire },
        currentExpression.id
      );

      if (operator !== "And") {
        return true;
      }

      const optionTypeSet = expressions
        .filter(referencesAnswerId(currentExpression.left.answerId))
        .flatMap((expression) => expression?.right?.optionIds)
        .filter(Boolean)
        .map(
          (optionId) =>
            getOptionById({ questionnaire }, optionId)?.mutuallyExclusive
        )
        .reduce((acc, type) => acc.add(type), new Set());

      console.log(`optionTypeSet`, optionTypeSet);
      isValid.errors =
        optionTypeSet.size === 1
          ? []
          : [
              createValidationError(
                instancePath,
                "groupOperator",
                ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
                questionnaire
              ),
            ];

      return isValid.errors.length === 0;
    },
  });
