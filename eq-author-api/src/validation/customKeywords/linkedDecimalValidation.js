const { get } = require("lodash");
const getEntityKeyValue = require("../../../utils/getEntityByKeyValue");

module.exports = function(ajv) {
  ajv.addKeyword("linkedDecimalValidation", {
    $data: true,
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData
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
            isValid.errors = [
              {
                keyword: "errorMessage",
                dataPath: dataPathArr.slice(0, 8).join("/"),
                message: "ERR_REFERENCED_ANSWER_DECIMAL_INCONSISTENCY",
                params: { keyword: "inconsistent decimals" },
              },
            ];
          }
        }
      });
      return false;
    },
  });
};
