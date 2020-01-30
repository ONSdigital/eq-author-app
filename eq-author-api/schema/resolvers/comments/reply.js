const uuid = require("uuid");
const { remove } = require("lodash");

const { getPageById } = require("../utils");

const {
  getCommentsForQuestionnaire,
  saveComments,
} = require("../../../utils/datastore");

const pubsub = require("../../../db/pubSub");
const publishCommentUpdates = (questionnaire, pageId) => {
  pubsub.publish("commentsUpdated", {
    questionnaire,
    pageId,
  });
};

const Resolvers = {};

Resolvers.Mutation = {
  createReply: async (_, { input }, ctx) => {
    const { pageId } = input;
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const newReply = {
      id: uuid.v4(),
      parentCommentId: input.commentId,
      commentText: input.commentText,
      userId: ctx.user.id,
      createdTime: new Date(),
      pageId: pageId,
    };

    let parentComment = questionnaireComments.comments[pageId].find(
      ({ id }) => id === input.commentId
    );

    if (parentComment) {
      parentComment.replies.push(newReply);
    } else {
      parentComment = [newReply];
    }

    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, pageId);

    return newReply;
  },

  updateReply: async (_, { input }, ctx) => {
    const { pageId } = input;
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );
    const replies = questionnaireComments.comments[pageId].find(
      ({ id }) => id === input.commentId
    ).replies;

    if (!replies) {
      throw new Error("No replies found!");
    }

    const replyToEdit = replies.find(({ id }) => id === input.replyId);
    replyToEdit.commentText = input.commentText;
    replyToEdit.editedTime = new Date();
    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, pageId);
    return replyToEdit;
  },

  deleteReply: async (_, { input }, ctx) => {
    const { pageId } = input;
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const replies = questionnaireComments.comments[pageId].find(
      ({ id }) => id === input.commentId
    ).replies;

    if (replies) {
      remove(replies, ({ id }) => id === input.replyId);
      await saveComments(questionnaireComments);
    }
    publishCommentUpdates(questionnaire, pageId);

    const page = getPageById(ctx, pageId);
    return page;
  },
};

module.exports = { Resolvers };
