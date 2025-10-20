const createValidationError = require("../createValidationError");

const { ERR_NO_ANSWERS } = require("../../../constants/validationErrorCodes");
const { getFolderByAnswerId } = require("../../../schema/resolvers/utils");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "calculatedSummaryMinAnswers",
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
      if (parentData.summaryAnswers.length > 1) {
        return true;
      }

      if (parentData.summaryAnswers.length === 1) {
        let selectedFolder = getFolderByAnswerId(
          { questionnaire },
          parentData.summaryAnswers[0]
        );
        if (selectedFolder?.listId) {
          return true;
        }
      }

      isValid.errors = [
        createValidationError(
          instancePath,
          fieldName,
          ERR_NO_ANSWERS,
          questionnaire
        ),
      ];
      return false;
    },
  });
