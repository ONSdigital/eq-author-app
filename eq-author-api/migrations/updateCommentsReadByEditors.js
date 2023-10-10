const {
  getQuestionnaireMetaById,
  getCommentsForQuestionnaire,
  saveComments,
} = require("../db/datastore");

module.exports = async (questionnaire) => {
  const metadata = await getQuestionnaireMetaById(questionnaire.id);
  const commentsData = await getCommentsForQuestionnaire(questionnaire.id);
  const { createdBy, editors } = metadata;

  Object.entries(commentsData.comments).forEach(([, componentComments]) => {
    componentComments.forEach((comment) => {
      if (!comment.readBy) {
        comment.readBy = [createdBy, ...editors];
      }
      comment.replies.forEach((reply) => {
        if (!reply.readBy) {
          reply.readBy = [createdBy, ...editors];
        }
      });
    });
  });

  // await saveComments({
  //   questionnaireId: commentsData.questionnaireId,
  //   comments: commentsData.comments,
  // });

  await saveComments({
    questionnaireId: questionnaire.id,
    comments: commentsData.comments,
  });

  return questionnaire;
};
