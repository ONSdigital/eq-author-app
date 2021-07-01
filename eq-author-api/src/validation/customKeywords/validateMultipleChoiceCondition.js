const {
  ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const { getOptionById } = require("../../../schema/resolvers/utils");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "validateMultipleChoiceCondition",
    schema: false,
    validate: function isValid(
      data,
      {
        rootData: questionnaire,
        parentData,
        parentDataProperty: fieldName,
        instancePath,
      }
    ) {
      if (parentData?.right?.type === "SelectedOptions") {
        const selectedCheckboxOptions =
          parentData.right.optionIds?.map?.((optionId) =>
            getOptionById({ questionnaire }, optionId)
          ) ?? [];

        const mutuallyExclusiveOption = selectedCheckboxOptions.find(
          (option) => option?.mutuallyExclusive
        );

        if (
          selectedCheckboxOptions.length > 1 &&
          data === "AllOf" &&
          mutuallyExclusiveOption
        ) {
          isValid.errors = [
            createValidationError(
              instancePath,
              fieldName,
              ERR_RIGHTSIDE_MIXING_OR_STND_OPTIONS_IN_AND_RULE,
              questionnaire
            ),
          ];

          return false;
        }
      }
      return true;
    },
  });
