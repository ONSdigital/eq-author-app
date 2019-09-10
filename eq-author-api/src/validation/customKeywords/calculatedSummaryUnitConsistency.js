const { get, uniq } = require("lodash");

module.exports = function(ajv) {
  ajv.addKeyword("calculatedSummaryUnitConsistency", {
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
      const currentSectionAnswers = otherFields[
        currentSectionIndex
      ].pages.reduce(
        (acc, page) =>
          page.hasOwnProperty("answers") ? [...acc, ...page.answers] : acc,
        []
      );
      const selectedAnswers = currentSectionAnswers.filter(answer =>
        parentData.summaryAnswers.includes(answer.id)
      );

      const units = selectedAnswers.map(selectedAnswer =>
        get(selectedAnswer, "properties.unit")
      );

      if (uniq(units).length > 1) {
        isValid.errors = [
          {
            keyword: "errorMessage",
            dataPath,
            message: "ERR_CALCULATED_UNIT_INCONSISTENCY",
            params: { keyword: "inconsistent units" },
          },
        ];
      }

      return false;
    },
  });
};
