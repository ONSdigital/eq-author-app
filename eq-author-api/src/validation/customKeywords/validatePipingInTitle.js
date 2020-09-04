const {
  PIPING_TITLE_DELETED,
  PIPING_TITLE_MOVED,
} = require("../../../constants/validationErrorCodes");
const cheerio = require("cheerio");
const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const { flatMap, compact } = require("lodash/fp");
const createValidationError = require("../createValidationError");

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

      const $ = cheerio.load(entityData);
      const pipedIdList = [];

      $("p")
        .find("span")
        .each(function(index, element) {
          pipedIdList.push($(element).data());
        });

      let pipedAnswerDeleted = false;
      let pipedAnswerMoved = false;

      pipedIdList.forEach(dataItem => {
        if (dataItem.piped === "answers") {
          const foundAnswerInPrevious = previousAnswersForPage.some(
            el => el.id === dataItem.id
          );
          if (!foundAnswerInPrevious) {
            pipedAnswerDeleted = true;
            const foundAnswerAfter = allAnswersForQuestionnaire.some(
              el => el.id === dataItem.id
            );
            if (foundAnswerAfter) {
              pipedAnswerMoved = true;
              pipedAnswerDeleted = false;
            }
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
