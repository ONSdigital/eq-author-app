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
} = require("../../../schema/resolvers/utils");

const pipedAnswerIdRegex = /data-piped="answers" data-id="(.+?)"/gm;

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
          const [, answerId] = matches;
          pipedIdList.push(trimDateRangeId(answerId));
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

      for (const pipedId of pipedIdList) {
        if (!idExists({ questionnaire }, pipedId)) {
          return hasError(PIPING_TITLE_DELETED);
        }

        // TODO : to be introduced alongside repeating answer
        const list = getListByAnswerId({ questionnaire }, pipedId);
        if (list) {
          let section = parentData;
          if (parentData.pageType) {
            section = getSectionByPageId({ questionnaire }, parentData.id);
          }
          if (
            list.id !== section.repeatingSectionListId ||
            !section.repeatingSection
          ) {
            return hasError(PIPING_TITLE_DELETED);
          }
        }

        if (
          getAbsolutePositionById({ questionnaire }, pipedId) >
          getAbsolutePositionById({ questionnaire }, parentData.id)
        ) {
          return hasError(PIPING_TITLE_MOVED);
        }
      }

      return true;
    },
  });
