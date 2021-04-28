const {
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../../constants/validationErrorCodes");
const createValidationError = require("../createValidationError");

const {
  getAbsolutePositionById,
  idExists,
} = require("../../../schema/resolvers/utils");

const pipedAnswerIdRegex = /data-piped="answers" data-id="(.+?)"/gm;

const trimDateRangeId = (id) => id.replace(/(from|to)$/, "");

module.exports = function (ajv) {
  ajv.addKeyword("validatePipingInTitle", {
    $data: true,
    validate: function isValid(
      _otherFields,
      pageTitle,
      _fieldValue,
      dataPath,
      { id: pageId },
      fieldName,
      questionnaire
    ) {
      isValid.errors = [];
      const pipedIdList = [];

      let matches;
      do {
        matches = pipedAnswerIdRegex.exec(pageTitle);
        if (matches && matches.length > 1) {
          const [, answerId] = matches;
          pipedIdList.push(trimDateRangeId(answerId));
        }
      } while (matches);

      if (!pipedIdList.length) {
        return true;
      }

      const hasError = (errorMessage) => {
        isValid.errors.push(
          createValidationError(
            dataPath,
            fieldName,
            errorMessage,
            questionnaire
          )
        );
        return false;
      };

      for (const pipedId of pipedIdList) {
        if (!idExists({ questionnaire }, pipedId)) {
          return hasError(PIPING_TITLE_DELETED);
        }

        if (
          getAbsolutePositionById({ questionnaire }, pipedId) >
          getAbsolutePositionById({ questionnaire }, pageId)
        ) {
          return hasError(PIPING_TITLE_MOVED);
        }
      }

      return true;
    },
  });
};
