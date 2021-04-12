module.exports = (questionnaire) => {
  if (questionnaire.locked === undefined || questionnaire.locked === null) {
    questionnaire.locked = false;
  }

  return questionnaire;
};
