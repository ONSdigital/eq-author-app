module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    section.sectionSummaryPageDescription = section.pageDescription;
    delete section.pageDescription;
  });

  return questionnaire;
};
