module.exports = function addSectionHubSettings(questionnaire) {
  questionnaire.sections.forEach((section) => {
    if (!section.summaryTitle) {
      section.summaryTitle = null;
    }
  });
  return questionnaire;
};
