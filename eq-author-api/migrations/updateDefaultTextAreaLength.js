//This is an auto-generated file.  Do NOT modify the method signature.

module.exports = function updateDefaultTextAreaLength(questionnaire) {
  questionnaire.sections.forEach(section => {
    section.pages.forEach(page => {
      page.answers.forEach(answer => {
        if (answer.type === "TextArea" && !answer.properties.maxLength) {
          answer.properties.maxLength = "2000";
        }
      });
    });
  });
  return questionnaire;
};
