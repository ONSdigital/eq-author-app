module.exports = function addSectionHubSettings(questionnaire) {
  questionnaire.sections.forEach((section) => {
    if (
      section.requiredCompleted === undefined ||
      section.requiredCompleted === null
    ) {
      section.requiredCompleted = false;
    }
    if (section.showOnHub === undefined || section.showOnHub === null) {
      section.showOnHub = true;
    }
    if (
      section.sectionSummary === undefined ||
      section.sectionSummary === null
    ) {
      section.sectionSummary = false;
    }
  });

  return questionnaire;
};
