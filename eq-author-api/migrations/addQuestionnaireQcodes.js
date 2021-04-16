module.exports = (questionnaire) => {
  if (questionnaire.qcodes === undefined || questionnaire.qcodes === null) {
    questionnaire.qcodes = true;
  }

  return questionnaire;
};
