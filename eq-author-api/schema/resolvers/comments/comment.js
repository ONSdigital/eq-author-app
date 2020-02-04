const uuid = require("uuid");
const { remove } = require("lodash");

// const { getPageById, getSectionById } = require("../utils");

const {
  getCommentsForQuestionnaire,
  saveComments,
} = require("../../../utils/datastore");

const pubsub = require("../../../db/pubSub");
const publishCommentUpdates = (questionnaire, pageId) => {
  console.log("\n\npublishCommentUpdates-------", pageId);
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
    const parentId = input.pageId ? input.pageId : input.sectionId;

    console.log("\nparentId", parentId);
    console.log("\nDelete input--------------", input);

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );
    const pageComments = questionnaireComments.comments[parentId];

    console.log("\nDelete pageComments-----------", pageComments);

    if (pageComments) {
      remove(pageComments, ({ id }) => id === input.commentId);
      await saveComments(questionnaireComments);
    }
    publishCommentUpdates(questionnaire, parentId);

    const { pageId, sectionId } = input;

    const deletedCommentReturn = {
      pageId: pageId,
      sectionId: sectionId,
    };

    return deletedCommentReturn;
    // let page, id;
    // if (input.pageId) {
    //   page = getPageById(ctx, parentId);
    //   console.log("\n\nDeleteComments - page return----------", page);
    //   return page;
    // } else if (input.sectionId) {
    //   id = {
    //     id: parentId,
    //   };
    //   //   section = getSectionById(ctx, parentId);
    //   console.log("\n\nDeleteComments - section return----------", parentId);
    //   return id;
    // }
  },

  createComment: async (_, { input }, ctx) => {
    const { pageId, sectionId } = input;

    console.log("\ncreateComment - input", input);
    console.log("\npageId", pageId);
    console.log("\nsectionId", sectionId);
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const newComment = {
      id: uuid.v4(),
      commentText: input.commentText,
      userId: ctx.user.id,
      createdTime: new Date(),
      pageId: pageId,
      sectionId: sectionId,
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
