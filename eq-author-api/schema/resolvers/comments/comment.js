const uuid = require("uuid");
const { remove } = require("lodash");

const { getPageByIdx } = require("../utils");

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
  updateComment: async (_, { input }, ctx) => {
    const { pageId } = input;
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );
    const pageComments = questionnaireComments.comments[pageId];

    if (!pageComments) {
      throw new Error("No comments found");
    }

    const commentToEdit = pageComments.find(({ id }) => id === input.commentId);
    commentToEdit.commentText = input.commentText;
    commentToEdit.editedTime = new Date();
    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, pageId);

    return commentToEdit;
  },

  deleteComment: async (_, { input }, ctx) => {
    const { pageId, sectionId } = input;

    console.log("\n\ninput--------------", input);

    console.log("\n\npageId--------------", pageId);
    console.log("\n\nsectionId--------------", sectionId);

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );
    console.log("questionnaireComments---------", questionnaireComments);
    const pageComments = questionnaireComments.comments[pageId];

    console.log("pageComments-----------", pageComments);

    if (pageComments) {
      remove(pageComments, ({ id }) => id === input.commentId);
      await saveComments(questionnaireComments);
    }
    publishCommentUpdates(questionnaire, pageId);
    let page, section;
    // if (pageId) {
    //   page = getPageById(ctx, pageId);
    // } else if (sectionId) {
    //   page = getSectionById(ctx, sectionId);
    // }

    section = getPageById(ctx, pageId);

    console.log("page----------", page);
    return section;
  },

  createComment: async (_, { input }, ctx) => {
    const { pageId, sectionId } = input;
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const newComment = {
      id: uuid.v4(),
      commentText: input.commentText,
      userId: ctx.user.id,
      createdTime: new Date(),
      pageId,
      //   sectionId: "test",
      replies: [],
    };

    const id = pageId || sectionId;

    const pageComments = questionnaireComments.comments[id];

    if (pageComments) {
      questionnaireComments.comments[id].push(newComment);
    } else {
      questionnaireComments.comments[id] = [newComment];
    }

    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, id);

    console.log("\n\n Create New Comment - newComment return :", newComment);
    return newComment;
  },
};

module.exports = { Resolvers };
