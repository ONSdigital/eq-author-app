const uuid = require("uuid");
const { remove } = require("lodash");

const {
  getCommentsForQuestionnaire,
  saveComments,
} = require("../../../utils/datastore");

const pubsub = require("../../../db/pubSub");

const publishCommentUpdates = (questionnaire, input) => {
  pubsub.publish("commentsUpdated", {
    questionnaire,
    input,
  });
};

const Resolvers = {};

Resolvers.Mutation = {
  updateComment: async (_, { input }, ctx) => {
    const { pageId, sectionId, confirmationId, introductionId } = input;
    const parentId = pageId || sectionId || confirmationId || introductionId;

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );
    const pageComments = questionnaireComments.comments[parentId];

    if (!pageComments) {
      throw new Error("No comments found");
    }

    const commentToEdit = pageComments.find(({ id }) => id === input.commentId);
    commentToEdit.commentText = input.commentText;
    commentToEdit.editedTime = new Date();

    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, input);
    return commentToEdit;
  },

  deleteComment: async (_, { input }, ctx) => {
    const { pageId, sectionId, confirmationId, introductionId } = input;
    const parentId = pageId || sectionId || confirmationId || introductionId;

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );
    const pageComments = questionnaireComments.comments[parentId];

    if (pageComments) {
      remove(pageComments, ({ id }) => id === input.commentId);
      await saveComments(questionnaireComments);
    }
    publishCommentUpdates(questionnaire, input);

    const deletedCommentReturn = {
      pageId: pageId,
      sectionId: sectionId,
      introductionId: introductionId,
      confirmationId: confirmationId,
    };
    return deletedCommentReturn;
  },

  createComment: async (_, { input }, ctx) => {
    const {
      pageId,
      sectionId,
      confirmationId,
      introductionId,
      commentText,
    } = input;
    const parentId = pageId || sectionId || confirmationId || introductionId;

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const newComment = {
      id: uuid.v4(),
      commentText,
      userId: ctx.user.id,
      createdTime: new Date(),
      pageId,
      sectionId,
      introductionId,
      confirmationId,
      replies: [],
    };

    const pageComments = questionnaireComments.comments[parentId];

    if (pageComments) {
      questionnaireComments.comments[parentId].push(newComment);
    } else {
      questionnaireComments.comments[parentId] = [newComment];
    }

    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, input);

    return newComment;
  },
};

module.exports = { Resolvers };
