const { get, uniq } = require("lodash");

const createValidationError = require("../createValidationError");

const {
  ERR_CALCULATED_UNIT_INCONSISTENCY,
} = require("../../../constants/validationErrorCodes");

module.exports = function(ajv) {
  ajv.addKeyword("calculatedSummaryUnitConsistency", {
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
        const err = createValidationError(
          dataPath,
          fieldName,
          ERR_CALCULATED_UNIT_INCONSISTENCY,
          questionnaire
        );
        isValid.errors.push(err);
      }

      return false;
    },
  });
};
