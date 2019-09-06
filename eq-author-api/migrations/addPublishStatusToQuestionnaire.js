//This is an auto-generated file.  Do NOT modify the method signature.

const UNPUBLISHED = "Unpublished";

module.exports = function addPublishStatusToQuestionnaire(questionnaire) {
  if (!questionnaire.hasOwnProperty("publishStatus")) {
    questionnaire.publishStatus = UNPUBLISHED;
  }
  return questionnaire;
};
