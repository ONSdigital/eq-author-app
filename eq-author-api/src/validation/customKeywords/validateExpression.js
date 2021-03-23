const {
  ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const { some } = require("lodash");

const {
  getExpressionGroupByExpressionId,
} = require("../../../schema/resolvers/utils/routing");

const { getOptionById } = require("../../../schema/resolvers/utils/answers");

module.exports = function (ajv) {
  ajv.addKeyword("validateExpression", {
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
      const { id: focusedExpressionId } = entityData;
      const {
        expressions,
        operator: expressionGroupCondition,
      } = getExpressionGroupByExpressionId(
        { questionnaire },
        focusedExpressionId
      );

      const expressionsWithoutNullLeft = expressions.filter(
        ({ left }) => left.type !== "Null"
      );

      if (
        expressionsWithoutNullLeft &&
        entityData &&
        entityData.right &&
        entityData.right.optionIds
      ) {
        const { condition, left } = entityData;

        const leftAnswerId = left.answerId;

        const numOfOccurancesOfLeft = expressionsWithoutNullLeft.filter(
          ({ left }) => left.answerId === leftAnswerId
        );

        if (numOfOccurancesOfLeft.length === 1) {
          return true;
        }

        const selectedOptions = entityData.right.optionIds.map((optionId) =>
          getOptionById({ questionnaire }, optionId)
        );

        const selectionContainsMutuallyExclusive =
          selectedOptions.length > 1 &&
          some(selectedOptions, ({ mutuallyExclusive }) => mutuallyExclusive);

        const selectionContainsOnlyMutuallyExclusive =
          selectedOptions.length === 1 &&
          selectedOptions[0] &&
          selectedOptions[0].mutuallyExclusive;

        if (
          expressionsWithoutNullLeft.length > 0 &&
          expressionGroupCondition === "And" &&
          (selectionContainsOnlyMutuallyExclusive ||
            (selectionContainsMutuallyExclusive && condition === "AnyOf"))
        ) {
          const err = createValidationError(
            dataPath,
            "groupOperator",
            ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
            questionnaire
          );

          isValid.errors.push(err);
          return false;
        }
      }
      return true;
    },
  });
};
