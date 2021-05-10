//This is an auto-generated file.  Do NOT modify the method signature.
module.exports = function addHistoryToQuestionnaire(questionnaire) {
  if (!questionnaire.history) {
    questionnaire.history = [
      {
        id: "creationEvent",
        publishStatus: "Questionnaire created",
        questionnaireTitle: questionnaire.title,
        userId: questionnaire.createdBy,
        time: questionnaire.createdAt,
      },
    ];
  }
  return questionnaire;
};
