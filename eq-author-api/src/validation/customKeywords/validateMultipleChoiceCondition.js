const {
  ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const { getOptionById } = require("../../../schema/resolvers/utils");

module.exports = function (ajv) {
  ajv.addKeyword("validateMultipleChoiceCondition", {
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

      if (
        parentData &&
        parentData.right &&
        parentData.right.type === "SelectedOptions" &&
        parentData.right.optionIds
      ) {
        const selectedCheckboxOptions = parentData.right.optionIds.map(
          (optionId) => getOptionById({ questionnaire }, optionId)
        );

        const mutuallyExclusiveOption = selectedCheckboxOptions.filter(
          (option) => option && option.mutuallyExclusive
        ).length;

        if (
          selectedCheckboxOptions.length > 1 &&
          entityData === "AllOf" &&
          mutuallyExclusiveOption
        ) {
          const err = createValidationError(
            dataPath,
            fieldName,
            ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE,
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
