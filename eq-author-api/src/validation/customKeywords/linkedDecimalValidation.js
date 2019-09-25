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

      if (currentAnswerValidation.minValue.entityType === "PreviousAnswer") {
        const referencedAnswerId =
          currentAnswerValidation.minValue.previousAnswer;
        const referencedAnswer = getEntityKeyValue(
          otherFields,
          referencedAnswerId
        )[0];
        if (
          parentData.decimals !== get(referencedAnswer, "properties.decimals")
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
      return false;
    },
  });
};
