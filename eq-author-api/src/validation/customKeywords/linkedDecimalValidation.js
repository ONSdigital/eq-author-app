const { get } = require("lodash");

const {
  ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY,
} = require("../../../constants/validationErrorCodes");

const getEntityKeyValue = require("../../../utils/getEntityByKeyValue");
const createValidationError = require("../createValidationError");

module.exports = function(ajv) {
  ajv.addKeyword("linkedDecimalValidation", {
    $data: true,
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

      const dataPathArr = dataPath.split("/");
      const currentSectionIndex = dataPathArr[2];
      const currentPageIndex = dataPathArr[4];
      const currentAnswerIndex = dataPathArr[6];
      const currentAnswerValidation =
        otherFields[currentSectionIndex].pages[currentPageIndex].answers[
          currentAnswerIndex
        ].validation;

      const minValidation = currentAnswerValidation.minValue;
      const maxValidation = currentAnswerValidation.maxValue;
      [minValidation, maxValidation].forEach(validation => {
        if (
          validation &&
          validation.enabled &&
          validation.entityType === "PreviousAnswer"
        ) {
          const referencedAnswerId = validation.previousAnswer;
          const referencedAnswer = getEntityKeyValue(
            otherFields,
            referencedAnswerId
          )[0];
          const referencedDecimals = get(
            referencedAnswer,
            "properties.decimals"
          );

          if (
            referencedDecimals !== (null || undefined) &&
            parentData.decimals !== (null || undefined) &&
            parentData.decimals !== referencedDecimals
          ) {
            const err = createValidationError(
              dataPath,
              fieldName,
              ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY,
              questionnaire
            );
            isValid.errors.push(err);
          }
        }
      });
      return false;
    },
  });
};
