const {
  ERR_GROUP_MIXING_EXPRESSIONS_WITH_OR_STND_OPTIONS_IN_AND,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const { getOptionById } = require("../../../schema/resolvers/utils");

module.exports = function(ajv) {
  ajv.addKeyword("validateExpressionGroupOperator", {
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

      if (parentData && parentData.expressions) {
        const { expressions } = parentData;
        const expressionsWithMutuallyExclusiveSelected = expressions.filter(
          ({ right }) => {
            if (!right || !right.optionIds) {
              return false;
            }
            const selectedCheckboxOptions = right.optionIds.map(optionId =>
              getOptionById({ questionnaire }, optionId)
            );
            const mutuallyExclusiveOption = selectedCheckboxOptions.filter(
              ({ mutuallyExclusive }) => mutuallyExclusive
            );

            return mutuallyExclusiveOption.length ? true : false;
          }
        );

        if (
          expressions.length > 1 &&
          entityData === "And" &&
          expressionsWithMutuallyExclusiveSelected.length > 0
        ) {
          const err = createValidationError(
            dataPath,
            fieldName,
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
