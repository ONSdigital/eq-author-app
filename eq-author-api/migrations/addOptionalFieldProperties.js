//This is an auto-generated file.  Do NOT modify the method signature.
const { isEmpty } = require("lodash");

module.exports = function addOptionalFieldProperties(questionnaire) {
  questionnaire.sections.forEach(section => {
    section.pages.forEach(page => {
      if (!isEmpty(page.description)) {
        page.descriptionEnabled = true;
      }
      if (!isEmpty(page.guidance)) {
        page.guidanceEnabled = true;
      }
      if (!isEmpty(page.definitionLabel) || !isEmpty(page.definitionContent)) {
        page.definitionEnabled = true;
      }
      if (
        !isEmpty(page.additionalInfoLabel) ||
        !isEmpty(page.additionalInfoContent)
      ) {
        page.additionalInfoEnabled = true;
      }
    });
  });

  return questionnaire;
};
