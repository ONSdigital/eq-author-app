const { get, uniq, flatMap } = require("lodash");

const createValidationError = require("../createValidationError");

const {
  ERR_CALCULATED_UNIT_INCONSISTENCY,
} = require("../../../constants/validationErrorCodes");
const { getPath } = require("../utils");

module.exports = function (ajv) {
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

      const { sections } = getPath(dataPath);

      const pages = flatMap(
        otherFields[sections].folders,
        (folder) => folder.pages
      );

      const currentSectionAnswers = pages.reduce(
        (acc, page) =>
          page.hasOwnProperty("answers") ? [...acc, ...page.answers] : acc,
        []
      );

      const selectedAnswers = currentSectionAnswers.filter((answer) =>
        parentData.summaryAnswers.includes(answer.id)
      );

      const units = selectedAnswers.map((selectedAnswer) =>
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
