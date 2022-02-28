const checkIntroductionShowOnHub = (questionnaire) => {
  if (!questionnaire.hub) {
    questionnaire.introduction.showOnHub = false;
  }
};

module.exports = (questionnaire) => {
  checkIntroductionShowOnHub(questionnaire);
};
