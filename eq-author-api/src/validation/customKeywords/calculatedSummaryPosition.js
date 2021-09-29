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

      const folder = getFolderByPageId({ questionnaire }, calcSumId);
      const section = getSectionByFolderId({ questionnaire }, folder.id);

      const calcSumPos = {
        folder: section.folders.map((folder) => folder.id).indexOf(folder.id),
        page: folder.pages.map((page) => page.id).indexOf(calcSumId),
      };

      answerIdsToCalc.forEach((id) => {
        const page = getPageByAnswerId({ questionnaire }, id);

        if (page) {
          const folder = getFolderByPageId({ questionnaire }, page.id);
          const folderPos = section.folders
            .map((folder) => folder.id)
            .indexOf(folder.id);

          if (calcSumPos.folder < folderPos) {
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
      });

      if (isValid.errors.length) {
        return false;
      }

      return true;
    },
  });
