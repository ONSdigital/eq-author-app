module.exports = (questionnaire) => {
  if (!questionnaire.introduction.additionalGuidancePanelSwitch) {
    questionnaire.introduction.additionalGuidancePanel = "";
    questionnaire.introduction.additionalGuidancePanelSwitch = false;
  }

  return questionnaire;
};
