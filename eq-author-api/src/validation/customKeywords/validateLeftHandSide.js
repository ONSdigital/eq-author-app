const {
  ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
} = require("../../../constants/validationErrorCodes");

const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const {
  ROUTING_ANSWER_TYPES,
} = require("../../../constants/routingAnswerTypes");

module.exports = function(ajv) {
  ajv.addKeyword("validateLeftHandSide", {
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

      const dataPathArr = dataPath.split("/");
      const currentSectionIndex = dataPathArr[2];
      const currentPageIndex = dataPathArr[4];
      const currentPage =
        questionnaire.sections[currentSectionIndex].pages[currentPageIndex];

      if (entityData && entityData.type === "Answer" && entityData.answerId) {
        const leftAnswerId = entityData.answerId;

        const previousAnswersForPage = getPreviousAnswersForPage(
          questionnaire,
          currentPage.id,
          true,
          ROUTING_ANSWER_TYPES
        );

        const leftAnswerInPreviousAnswers = previousAnswersForPage.some(
          el => el.id === leftAnswerId
        );

        if (!leftAnswerInPreviousAnswers) {
          isValid.errors = [
            {
              keyword: "errorMessage",
              dataPath,
              message: ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
              params: {},
            },
          ];
          return false;
        }
      }
      return true;
    },
  });
};
