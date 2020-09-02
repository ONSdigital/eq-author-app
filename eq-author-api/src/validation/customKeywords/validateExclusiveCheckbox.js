const {
  ERR_RIGHTSIDE_AND_OR_NOT_ALLOWED,
  ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const {
  getOptionById,
  getExpressionGroupByExpressionId,
} = require("../../../schema/resolvers/utils");
const { filter } = require("lodash");

module.exports = function(ajv) {
  ajv.addKeyword("validateExclusiveCheckbox", {
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
      let exclusiveOptionId;

      if (
        entityData &&
        entityData.type === "SelectedOptions" &&
        entityData.optionIds
      ) {
        entityData.optionIds.map(optionId => {
          const option = getOptionById({ questionnaire }, optionId);
          if (option && option.mutuallyExclusive) {
            exclusiveOptionId = optionId;
          }
        });
        if (exclusiveOptionId) {
          if (parentData.condition === "AllOf") {
            const err = createValidationError(
              dataPath,
              fieldName,
              ERR_RIGHTSIDE_AND_OR_NOT_ALLOWED,
              questionnaire
            );
            isValid.errors.push(err);

            return false;
          }

          const expressionGroup = getExpressionGroupByExpressionId(
            { questionnaire },
            parentData.id
          );
          if (
            expressionGroup.operator === "And" &&
            entityData.optionIds.length > 1
          ) {
            const err = createValidationError(
              dataPath,
              fieldName,
              ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
              questionnaire
            );
            isValid.errors.push(err);

            return false;
          }

          const countCheckboxAnswers = filter(expressionGroup.expressions, {
            left: { answerId: parentData.left.answerId },
          }).length;
          if (expressionGroup.operator === "And" && countCheckboxAnswers > 1) {
            const err = createValidationError(
              dataPath,
              fieldName,
              ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
              questionnaire
            );
            isValid.errors.push(err);

            return false;
          }
        }
      }
      return true;
    },
  });
};
