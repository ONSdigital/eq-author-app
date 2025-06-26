const {
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../../constants/validationErrorCodes");
const createValidationError = require("../createValidationError");

const {
  getAbsolutePositionById,
  idExists,
  getListByAnswerId,
  getSupplementaryDataAsCollectionListbyFieldId,
  getFolderByAnswerId,
  getSectionByFolderId,
} = require("../../../schema/resolvers/utils");

const pipedAnswerIdRegex =
  /data-piped="(answers|supplementary)" data-id="(.+?)"/gm;

const trimDateRangeId = (id) => id.replace(/(from|to)$/, "");

module.exports = (ajv) =>
  ajv.addKeyword({
    $data: true,
    keyword: "validatePipingAnswerInLabel",
    validate: function isValid(
      _schema,
      label,
      _parentSchema,
      {
        parentData,
        parentDataProperty: fieldName,
        instancePath,
        rootData: questionnaire,
      }
    ) {
      const folder =
        getFolderByAnswerId({ questionnaire }, parentData.id) || {};
      let section = {};
      if (folder.id) {
        section = getSectionByFolderId({ questionnaire }, folder.id);
      }

      isValid.errors = [];
      const pipedIdList = [];

      let matches;

      do {
        matches = pipedAnswerIdRegex.exec(label);

        if (matches && matches.length > 1) {
          const [, dataPiped, answerId] = matches;
          pipedIdList.push([trimDateRangeId(answerId), dataPiped]);
        }
      } while (matches);

      if (!pipedIdList.length) {
        return true;
      }

      const hasError = (errorMessage) => {
        isValid.errors = [
          createValidationError(
            instancePath,
            fieldName,
            errorMessage,
            questionnaire,
            "deleted answer in label"
          ),
        ];

        return false;
      };

      for (const [pipedId, dataPiped] of pipedIdList) {
        if (!idExists({ questionnaire }, pipedId)) {
          return hasError(PIPING_TITLE_DELETED);
        }

        const list =
          getListByAnswerId({ questionnaire }, pipedId) ||
          getSupplementaryDataAsCollectionListbyFieldId(
            { questionnaire },
            pipedId
          );

        if (list) {
          if (!(dataPiped === "supplementary" && list.listName === "")) {
            if (
              !parentData.repeatingLabelAndInput &&
              !section.repeatingSection &&
              !folder.listId
            ) {
              return hasError(PIPING_TITLE_DELETED);
            }

            if (
              (parentData.repeatingLabelAndInput &&
                list.id !== parentData.repeatingLabelAndInputListId) ||
              (folder.listId && list.id !== folder.listId) ||
              (section.repeatingSection &&
                list.id !== section.repeatingSectionListId)
            ) {
              return hasError(PIPING_TITLE_DELETED);
            }
          }
        }

        if (dataPiped !== "supplementary") {
          if (
            getAbsolutePositionById({ questionnaire }, pipedId) >
            getAbsolutePositionById({ questionnaire }, parentData.id)
          ) {
            return hasError(PIPING_TITLE_MOVED);
          }
        }
      }

      return true;
    },
  });
