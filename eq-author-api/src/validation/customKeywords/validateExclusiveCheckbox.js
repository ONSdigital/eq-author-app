const {
  ERR_RIGHTSIDE_OR_WITH_STANDARD_OPTIONS_IN_AND_RULE,
  ERR_RIGHTSIDE_OR_WITH_STANDARD_OPTIONS_IN_OR_RULE_WITH_AND_GROUP,
  //ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
} = require("../../../constants/validationErrorCodes");

const createValidationError = require("../createValidationError");

const {
  getOptionById,
  getExpressionGroupByExpressionId,
} = require("../../../schema/resolvers/utils");

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

      const { operator: groupOperator } = getExpressionGroupByExpressionId(
        { questionnaire },
        parentData.id
      );
      const { condition: ruleCondition } = parentData;
      let selectedCheckboxOptions;
      let mutuallyExclusiveOption;

      if (
        entityData &&
        entityData.type === "SelectedOptions" &&
        entityData.optionIds
      ) {
        selectedCheckboxOptions = entityData.optionIds.map(optionId =>
          getOptionById({ questionnaire }, optionId)
        );

        mutuallyExclusiveOption = selectedCheckboxOptions.filter(
          ({ mutuallyExclusive }) => mutuallyExclusive
        );

        if (selectedCheckboxOptions.length === 1 && mutuallyExclusiveOption) {
          return true;
        }

        if (
          selectedCheckboxOptions.length > 1 &&
          mutuallyExclusiveOption &&
          ruleCondition === "AllOf"
        ) {
          const err = createValidationError(
            dataPath,
            fieldName,
            ERR_RIGHTSIDE_OR_WITH_STANDARD_OPTIONS_IN_AND_RULE,
            questionnaire
          );

          isValid.errors.push(err);

          return false;
        }

        if (
          groupOperator === "And" &&
          selectedCheckboxOptions.length > 1 &&
          mutuallyExclusiveOption
        ) {
          const err = createValidationError(
            dataPath,
            fieldName,
            ERR_RIGHTSIDE_OR_WITH_STANDARD_OPTIONS_IN_OR_RULE_WITH_AND_GROUP,
            questionnaire
          );

          isValid.errors.push(err);

          return false;
        }

        // if (mutuallyExclusiveOption) {
        //   if (groupOperator === "And" && selectedCheckboxOptions > 1) {
        //     const err = createValidationError(
        //       dataPath,
        //       fieldName,
        //       ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
        //       questionnaire
        //     );
        //     isValid.errors.push(err);

        //     return false;
        //   }

        //   const countCheckboxAnswers = filter(expressionGroup.expressions, {
        //     left: { answerId: parentData.left.answerId },
        //   }).length;
        //   if (expressionGroup.operator === "And" && countCheckboxAnswers > 1) {
        //     const err = createValidationError(
        //       dataPath,
        //       fieldName,
        //       ERR_RIGHTSIDE_ALLOFF_OR_NOT_ALLOWED,
        //       questionnaire
        //     );
        //     isValid.errors.push(err);

        //     return false;
        //   }
        // }
      }
      return true;
    },
  });
};
