module.exports = (questionnaire) => {
  questionnaire.sections.forEach((section) => {
    section.folders.forEach((folder) => {
      folder.pages.forEach((page) => {
        if (page.confirmation && page.confirmation.qCode) {
          delete page.confirmation.qCode;
        }
      });
    });
  });

  return questionnaire;
};
