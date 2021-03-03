//This is an auto-generated file.  Do NOT modify the method signature.
const { isEmpty } = require("lodash");

module.exports = function addOptionalFieldProperties(questionnaire) {
  questionnaire.sections.forEach((section) => {
    section.pages.forEach((page) => {
      page.descriptionEnabled = !isEmpty(page.description);
      page.guidanceEnabled = !isEmpty(page.guidance);
      page.definitionEnabled =
        !isEmpty(page.definitionLabel) || !isEmpty(page.definitionContent);
      page.additionalInfoEnabled =
        !isEmpty(page.additionalInfoLabel) ||
        !isEmpty(page.additionalInfoContent);
    });
  });

  return questionnaire;
};
