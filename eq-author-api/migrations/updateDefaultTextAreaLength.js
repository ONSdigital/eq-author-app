//This is an auto-generated file.  Do NOT modify the method signature.

module.exports = function updateDefaultTextAreaLength(questionnaire) {
  questionnaire.sections.forEach((section) => {
    if (section.pages) {
      section.pages.forEach((page) => {
        if (page.answers) {
          page.answers.forEach((answer) => {
            if (answer.type === "TextArea" && !answer.properties.maxLength) {
              answer.properties.maxLength = "2000";
            }
          });
        }
      });
    }
  });
  return questionnaire;
};
