module.exports = function updateIntroductionPreviewQuestionsSettings(
  questionnaire
) {
  if (questionnaire.introduction) {
    if (!questionnaire.introduction.previewQuestions) {
      questionnaire.introduction.previewQuestions = false;
    }
    if (!questionnaire.introduction.disallowPreviewQuestions) {
      questionnaire.introduction.disallowPreviewQuestions = false;
    }
    if (
      questionnaire.collectionLists &&
      questionnaire.collectionLists.lists &&
      questionnaire.collectionLists.lists.length > 0
    ) {
      questionnaire.introduction.previewQuestions = false;
      questionnaire.introduction.disallowPreviewQuestions = true;
    }
    return questionnaire;
  }
};
