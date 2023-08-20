const {
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../../constants/validationErrorCodes");
const createValidationError = require("../createValidationError");

const {
  getAbsolutePositionById,
  idExists,
  getSectionByPageId,
  getListByAnswerId,
  getSupplementaryDataAsCollectionListbyFieldId,
} = require("../../../schema/resolvers/utils");

const pipedAnswerIdRegex = /data-piped="(.+?)" data-id="(.+?)"/gm;

const trimDateRangeId = (id) => id.replace(/(from|to)$/, "");

module.exports = (ajv) =>
  ajv.addKeyword({
    $data: true,
    keyword: "validatePipingAnswerInTitle",
    validate: function isValid(
      _schema,
      title,
      _parentSchema,
      {
        parentData,
        parentDataProperty: fieldName,
        instancePath,
        rootData: questionnaire,
      }
    ) {
      isValid.errors = [];
      const pipedIdList = [];

      let matches;

      do {
        matches = pipedAnswerIdRegex.exec(title);

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
            "deleted answer in title"
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
          let section = parentData;
          if (parentData.pageType) {
            section = getSectionByPageId({ questionnaire }, parentData.id);
          }

          if (!(dataPiped === "supplementary" && list.listName === "")) {
            if (
              list.id !== section.repeatingSectionListId ||
              !section.repeatingSection
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
