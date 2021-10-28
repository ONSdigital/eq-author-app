module.exports = (questionnaire) => {
  if (
    questionnaire.introduction &&
    !questionnaire.introduction.contactDetailsPanelSwitch
  ) {
    questionnaire.introduction.contactDetailsPanel = "";
    questionnaire.introduction.acontactDetailsPanelSwitch = false;
  }

  return questionnaire;
};
