const uuid = require("uuid");
const { remove } = require("lodash");

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
    const { pageId, sectionId, confirmationId, introductionId } = input;
    const parentPageId =
      pageId || sectionId || confirmationId || introductionId;

    console.log("\nreply.js/createReply - input", input);

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    console.log(
      "\nreply.js/createReply - - questionnaireComments - - - -",
      questionnaireComments
    );

    const newReply = {
      id: uuid.v4(),
      parentCommentId: input.commentId,
      commentText: input.commentText,
      userId: ctx.user.id,
      createdTime: new Date(),
      parentPageId: parentPageId,
    };

    console.log(
      "\n\nreply.js/createReply - questionnaireComments.comments[parentPageId]",
      questionnaireComments.comments[parentPageId]
    );
    let parentComment = questionnaireComments.comments[parentPageId].find(
      ({ id }) => id === input.commentId
    );

    if (parentComment) {
      parentComment.replies.push(newReply);
    } else {
      parentComment = [newReply];
    }

    await saveComments(questionnaireComments);

    console.log(
      "\nreply.js/createReply - newReply return----- - - - ",
      newReply
    );

    publishCommentUpdates(questionnaire, pageId);

    return newReply;
  },

  updateReply: async (_, { input }, ctx) => {
    const { pageId, sectionId, confirmationId, introductionId } = input;
    const parentId = pageId || sectionId || confirmationId || introductionId;

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );
    const replies = questionnaireComments.comments[parentId].find(
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
    console.log("\nreply.js/deleteReply - input", input);

    const { pageId, sectionId, confirmationId, introductionId } = input;
    const parentId = pageId || sectionId || confirmationId || introductionId;

    console.log("\nreply.js/deleteReply - parentId", parentId);

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const replies = questionnaireComments.comments[parentId].find(
      ({ id }) => id === input.commentId
    ).replies;
    console.log("\nreply.js/deleteReply - replies", replies);

    if (replies) {
      remove(replies, ({ id }) => id === input.replyId);
      await saveComments(questionnaireComments);
    }
    publishCommentUpdates(questionnaire, parentId);

    const deletedReplyReturn = {
      pageId: pageId,
      sectionId: sectionId,
      introductionId: introductionId,
      confirmationId: confirmationId,
    };

    console.log(
      "\nreply.js/deleteReply - return deletedCommentReturn",
      deletedReplyReturn
    );

    return deletedReplyReturn;
  },
};

module.exports = { Resolvers };
