module.exports = (questionnaire) => {
  questionnaire.hub = questionnaire.sections.length > 1;

  return questionnaire;
};
