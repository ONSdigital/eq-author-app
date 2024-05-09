const createValidationError = require("../createValidationError");

const { ERR_NO_ANSWERS } = require("../../../constants/validationErrorCodes");
const { getPages, getFolders } = require("../../../schema/resolvers/utils");

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
      } else {
        const folders = getFolders({ questionnaire });
        const pages = getPages({ questionnaire });

        const allAnswers = pages.reduce(
          (acc, page) => (page.answers ? [...acc, ...page.answers] : acc),
          []
        );

        const selectedAnswers = allAnswers.filter((answer) =>
          parentData.summaryAnswers.includes(answer.id)
        );

        let selectedFolder;
        folders.forEach((folder) => {
          folder.pages.forEach((page) => {
            if (page.id === selectedAnswers[0]?.questionPageId) {
              selectedFolder = folder;
            }
          });
        });

        if (parentData.summaryAnswers.length === 1 && selectedFolder?.listId) {
          return true;
        } else {
          isValid.errors = [
            createValidationError(
              instancePath,
              fieldName,
              ERR_NO_ANSWERS,
              questionnaire
            ),
          ];
          return false;
        }
      }
    },
  });
