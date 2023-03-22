module.exports = {
  ...require("./createQuestionnaire"),
  ...require("./deleteQuestionnaire"),
  ...require("./duplicateQuestionnaire"),
  ...require("./updateQuestionnaire"),
  ...require("./queryQuestionnaire"),
  ...require("./listQuestionnaires"),
  ...require("./publishQuestionnaire"),
  ...require("./reviewQuestionnaire"),
  ...require("./updateSurveyId"),
  ...require("./toggleQuestionnaireStarred"),
  ...require("./setQuestionnaireLocked"),
  ...require("./updateSubmission"),
};
