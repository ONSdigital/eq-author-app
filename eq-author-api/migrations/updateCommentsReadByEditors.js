const { getQuestionnaireMetaById } = require("../db/datastore");

module.exports = (questionnaire) => {
  const metadata = getQuestionnaireMetaById(questionnaire.id);
  const { createdBy, editors } = metadata;

  questionnaire.sections.forEach((section) => {
    section.comments.forEach((comment) => {
      if (!comment.readBy) {
        comment.readBy = [createdBy, ...editors];
      }
    });
    section.folders.forEach((folder) => {
      folder.pages.forEach((page) => {
        page.comments.forEach((comment) => {
          if (!comment.readBy) {
            comment.readBy = [createdBy, ...editors];
          }
        });
      });
    });
  });
  if (questionnaire.introduction) {
    questionnaire.introduction.comments.forEach((comment) => {
      if (!comment.readBy) {
        comment.readBy = [createdBy, ...editors];
      }
    });
  }
  if (questionnaire.submission) {
    questionnaire.submission.comments.forEach((comment) => {
      if (!comment.readBy) {
        comment.readBy = [createdBy, ...editors];
      }
    });
  }

  return questionnaire;
};
