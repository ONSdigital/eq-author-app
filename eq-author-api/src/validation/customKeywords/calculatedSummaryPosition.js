const {
  getPageByAnswerId,
  getFolderByPageId,
  getSectionByFolderId,
} = require("../../../schema/resolvers/utils");

const createValidationError = require("../createValidationError");

const { CALCSUM_MOVED } = require("../../../constants/validationErrorCodes");

module.exports = (ajv) =>
  ajv.addKeyword({
    keyword: "calculatedSummaryPosition",
    $data: true,
    validate: function isValid(
      schema,
      data,
      _parentSchema,
      {
        instancePath,
        rootData: questionnaire,
        parentData,
        parentDataProperty: fieldName,
      }
    ) {
      isValid.errors = [];
      const { id: calcSumId } = parentData;

      const answerIdsToCalc = data;

      const calcSumFolder = getFolderByPageId({ questionnaire }, calcSumId);
      const section = getSectionByFolderId({ questionnaire }, calcSumFolder.id);

      const calcSumPos = {
        folder: section.folders
          .map((folder) => folder.id)
          .indexOf(calcSumFolder.id),
        page: calcSumFolder.pages.map((page) => page.id).indexOf(calcSumId),
      };

      answerIdsToCalc.forEach((id) => {
        const page = getPageByAnswerId({ questionnaire }, id);

        if (page) {
          const pageFolder = getFolderByPageId({ questionnaire }, page.id);

          const inSameFolder = calcSumFolder.id === pageFolder.id;

          if (!inSameFolder) {
            const pageFolderPos = section.folders
              .map((folder) => folder.id)
              .indexOf(pageFolder.id);

            if (calcSumPos.folder < pageFolderPos) {
              isValid.errors.push(
                createValidationError(
                  instancePath,
                  fieldName,
                  CALCSUM_MOVED,
                  questionnaire
                )
              );
            }
          } else if (inSameFolder) {
            const calcSumPos = calcSumFolder.pages
              .map((page) => page.id)
              .indexOf(calcSumId);

            const pagePos = calcSumFolder.pages
              .map((page) => page.id)
              .indexOf(page.id);

            if (calcSumPos < pagePos) {
              isValid.errors.push(
                createValidationError(
                  instancePath,
                  fieldName,
                  CALCSUM_MOVED,
                  questionnaire
                )
              );
            }
          }
        }
      });

      if (isValid.errors.length) {
        return false;
      }

      return true;
    },
  });
