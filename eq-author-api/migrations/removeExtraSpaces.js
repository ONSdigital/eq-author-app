// Removes extra spaces from title, description, guidance, additionalInfoContent, and (answer) label fields
const removeExtraSpaces = (questionnaire) => {
  questionnaire.title = questionnaire.title.replace(/\s+/g, " ").trim();
  questionnaire?.sections?.forEach((section) => {
    section.title = section.title?.replace(/\s+/g, " ").trim();
    section?.folders?.forEach((folder) => {
      folder.title = folder.title?.replace(/\s+/g, " ").trim();
      folder?.pages?.forEach((page) => {
        page.title = page.title?.replace(/\s+/g, " ").trim();
        page.guidance = page.guidance?.replace(/\s+/g, " ").trim();
        page.description = page.description?.replace(/\s+/g, " ").trim();
        page.additionalInfoContent = page.additionalInfoContent
          ?.replace(/\s+/g, " ")
          .trim();
        page?.answers?.forEach((answer) => {
          answer.label = answer.label?.replace(/\s+/g, " ").trim();
          answer.guidance = answer.guidance?.replace(/\s+/g, " ").trim();
          answer.description = answer.description?.replace(/\s+/g, " ").trim();
        });
      });
    });
  });

  return questionnaire;
};

module.exports = (questionnaire) => removeExtraSpaces(questionnaire);
