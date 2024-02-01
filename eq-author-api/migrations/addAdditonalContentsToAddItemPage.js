module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    section.folders.forEach((folder) => {
      if (folder.listId !== undefined) {
        folder.pages.forEach((page) => {
          if (page.pageType === "ListCollectorAddItemPage") {
            if (page.descriptionEnabled === undefined) {
              page.descriptionEnabled = false;
            }
            if (page.guidanceEnabled === undefined) {
              page.guidanceEnabled = false;
            }
            if (page.definitionEnabled === undefined) {
              page.definitionEnabled = false;
            }
            if (page.additionalInfoEnabled === undefined) {
              page.additionalInfoEnabled = false;
            }
          }
        });
      }
    });
  });

  return questionnaire;
};
