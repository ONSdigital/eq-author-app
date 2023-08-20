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
} = require("../../../schema/resolvers/utils");

const pipedAnswerIdRegex = /data-piped="(.+?)" data-id="(.+?)"/gm;

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

        // TODO : to be introduced alongside repeating answer
        const list =
          getListByAnswerId({ questionnaire }, pipedId) ||
          getSupplementaryDataAsCollectionListbyFieldId(
            { questionnaire },
            pipedId
          );
        if (list) {
          if (list.id !== parentData.repeatingLabelAndInputListId) {
            return hasError(PIPING_TITLE_DELETED);
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
