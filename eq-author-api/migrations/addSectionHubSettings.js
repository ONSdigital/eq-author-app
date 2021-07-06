//This is an auto-generated file.  Do NOT modify the method signature.
module.exports = function addSectionHubSettings(questionnaire) {
  questionnaire.sections.forEach((section) => {
    if (!section.requiredCompleted || section.requiredCompleted === undefined || section.requiredCompleted === null) {
      section.requiredCompleted = false;
    }
    if (!section.showOnHub || section.showOnHub === undefined || section.showOnHub === null) {
      section.showOnHub = true;
    }
  });

  return questionnaire;
};
