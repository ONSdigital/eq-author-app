const { get, uniq, flatMap } = require("lodash");

const createValidationError = require("../createValidationError");

const {
  ERR_CALCULATED_UNIT_INCONSISTENCY,
} = require("../../../constants/validationErrorCodes");
const { getPath } = require("../utils");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "calculatedSummaryUnitConsistency",
    $data: true,
    validate: function isValid(
      schema,
      _data,
      _parentSchema,
      {
        instancePath,
        rootData: questionnaire,
        parentData,
        parentDataProperty: fieldName,
      }
    ) {
      const { sections } = getPath(instancePath);

      const pages = flatMap(schema[sections].folders, (folder) => folder.pages);

      const currentSectionAnswers = pages.reduce(
        (acc, page) => (page.answers ? [...acc, ...page.answers] : acc),
        []
      );

      const selectedAnswers = currentSectionAnswers.filter((answer) =>
        parentData.summaryAnswers.includes(answer.id)
      );

      const units = selectedAnswers.map((selectedAnswer) =>
        get(selectedAnswer, "properties.unit")
      );

      if (uniq(units).length > 1) {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            ERR_CALCULATED_UNIT_INCONSISTENCY,
            questionnaire
          ),
        ];

        return false;
      }

      return true;
    },
  });
