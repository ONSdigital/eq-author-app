const {
  ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
} = require("../../../constants/validationErrorCodes");

const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const {
  ROUTING_ANSWER_TYPES,
} = require("../../../constants/routingAnswerTypes");

const createValidationError = require("../createValidationError");

const { getPath } = require("../utils");

module.exports = function (ajv) {
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

      const { sections, folders, pages } = getPath(dataPath);

      const currentPage =
        questionnaire.sections[sections].folders[folders].pages[pages];

      if (entityData && entityData.type === "Answer" && entityData.answerId) {
        const leftAnswerId = entityData.answerId;

        const previousAnswersForPage = getPreviousAnswersForPage(
          questionnaire,
          currentPage.id,
          true,
          ROUTING_ANSWER_TYPES
        );

        const leftAnswerInPreviousAnswers = previousAnswersForPage.some(
          (el) => el.id === leftAnswerId
        );

        if (!leftAnswerInPreviousAnswers) {
          const err = createValidationError(
            dataPath,
            fieldName,
            ERR_LEFTSIDE_NO_LONGER_AVAILABLE,
            questionnaire
          );
          isValid.errors.push(err);

          return false;
        }
      }
      return true;
    },
  });
};
