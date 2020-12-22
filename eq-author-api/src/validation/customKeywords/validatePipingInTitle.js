const {
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../../constants/validationErrorCodes");
const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const { flatMap, compact } = require("lodash/fp");
const createValidationError = require("../createValidationError");

const pipedAnswerIdRegex = /data-piped="answers" data-id="(.+?)"/gm;

module.exports = function(ajv) {
  ajv.addKeyword("validatePipingInTitle", {
    $data: true,
    validate: function isValid(
      otherFields,
      entityData,
      fieldValue,
      dataPath,
      parentData,
      fieldName,
      questionnaire
    ) {
      isValid.errors = [];

      const pipedIdList = [];

      let matches;
      do {
        matches = pipedAnswerIdRegex.exec(entityData);
        if (matches && matches.length > 1) {
          pipedIdList.push(matches[1]);
        }
      } while (matches);

      if (!pipedIdList.length) {
        return true;
      }

      const splitDataPath = dataPath.split("/");
      const currentPage =
        questionnaire.sections[splitDataPath[2]].pages[splitDataPath[4]];

      const allPagesForQuestionnaire = flatMap(
        section => section.pages,
        questionnaire.sections
      );
      const allAnswersForQuestionnaire = compact(
        flatMap(page => page.answers, allPagesForQuestionnaire)
      );

      const previousAnswersForPage = getPreviousAnswersForPage(
        questionnaire,
        currentPage.id,
        true
      );

      let pipedAnswerDeleted = false;
      let pipedAnswerMoved = false;

      pipedIdList.forEach(answerId => {
        const foundAnswerInPrevious = previousAnswersForPage.some(
          el => el.id === answerId
        );
        if (!foundAnswerInPrevious) {
          pipedAnswerDeleted = true;
          const foundAnswerAfter = allAnswersForQuestionnaire.some(
            el => el.id === answerId
          );
          if (foundAnswerAfter) {
            pipedAnswerMoved = true;
            pipedAnswerDeleted = false;
          }
        }
      });

      if (pipedAnswerDeleted) {
        const err = createValidationError(
          dataPath,
          fieldName,
          PIPING_TITLE_DELETED,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }
      if (pipedAnswerMoved) {
        const err = createValidationError(
          dataPath,
          fieldName,
          PIPING_TITLE_MOVED,
          questionnaire
        );
        isValid.errors.push(err);

        return false;
      }
      return true;
    },
  });
};
