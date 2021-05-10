//This is an auto-generated file.  Do NOT modify the method signature.

const UNPUBLISHED = "Unpublished";

module.exports = function addPublishStatusToQuestionnaire(questionnaire) {
  if (!Object.prototype.hasOwnProperty.call(questionnaire, "publishStatus")) {
    questionnaire.publishStatus = UNPUBLISHED;
  }
  return questionnaire;
};
