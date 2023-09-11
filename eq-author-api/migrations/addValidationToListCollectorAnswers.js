module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    section.folders.forEach((folder) => {
      if (folder.listId !== undefined) {
        folder.pages.forEach((page) => {
          if (
            page.pageType === "ListCollectorQualifierPage" ||
            page.pageType === "ListCollectorConfirmationPage"
          ) {
            page.answers.forEach((answer) => {
              if (answer.validation === undefined) {
                answer.validation = {};
              }
            });
          }
        });
      }
    });
  });

  return questionnaire;
};
