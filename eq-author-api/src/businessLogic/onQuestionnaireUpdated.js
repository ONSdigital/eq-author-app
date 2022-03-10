const checkIntroductionShowOnHub = (questionnaire) => {
  if (questionnaire.introduction && !questionnaire.hub) {
    questionnaire.introduction.showOnHub = false;
  }
};

module.exports = (questionnaire) => {
  checkIntroductionShowOnHub(questionnaire);
};
