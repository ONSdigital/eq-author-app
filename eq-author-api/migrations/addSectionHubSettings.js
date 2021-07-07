module.exports = function addSectionHubSettings(questionnaire) {
  questionnaire.sections.forEach((section) => {
    console.log('section :>> ', section);
    if (section.requiredCompleted === undefined || section.requiredCompleted === null) {
      section.requiredCompleted = false;
    }
    if (section.showOnHub === undefined || section.showOnHub === null) {
      section.showOnHub = true;
    }
    console.log('section : after >> ', section);

  });

  return questionnaire;
};
