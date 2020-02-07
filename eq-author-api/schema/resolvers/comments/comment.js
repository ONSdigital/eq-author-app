const uuid = require("uuid");
const { remove } = require("lodash");

const {
  getCommentsForQuestionnaire,
  saveComments,
} = require("../../../utils/datastore");

const pubsub = require("../../../db/pubSub");
const publishCommentUpdates = (questionnaire, input) => {
  console.log("\n\npublishCommentUpdates - input -------", input);
  //   const getMapKeyValueByIndex = (obj, idx) => {
  //     const key = Object.keys(obj)[idx];
  //     const val = obj[key];
  //     console.log("key", key);
  //     const temp = { key: val };
  //     return temp;
  //   };
  //   const temp3 = getMapKeyValueByIndex(input, 0);

  const temp3 = {
    pageId: "1a5e9673-aeb2-4946-a520-8aff4ca5166c",
  };

  console.log("temp3", temp3);

  pubsub.publish("commentsUpdated", {
    questionnaire,
    temp3,
  });
};

const Resolvers = {};

Resolvers.Mutation = {
  updateComment: async (_, { input }, ctx) => {
    const { pageId, sectionId, confirmationId, introductionId } = input;
    const parentId = pageId || sectionId || confirmationId || introductionId;
    console.log("\nComment.js/updateCommentComment - input", input);

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

    console.log("commentToEdit - - - -  - - ", commentToEdit);

    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, pageId);
    return commentToEdit;
  },

  deleteComment: async (_, { input }, ctx) => {
    const { pageId, sectionId, confirmationId, introductionId } = input;
    const parentId = pageId || sectionId || confirmationId || introductionId;
    console.log("\nComment.js/deleteComment - input", input);

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
    console.log("Comment.js/deleteComment - return", deletedCommentReturn);
    return deletedCommentReturn;
  },

  createComment: async (_, { input }, ctx) => {
    const { pageId, sectionId, confirmationId, introductionId } = input;
    const id = pageId || sectionId || confirmationId || introductionId;

    console.log("\ncomment.js/createComment - input", input);

    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    console.log("\nquestionnaireComments", questionnaireComments);

    const newComment = {
      id: uuid.v4(),
      commentText: input.commentText,
      userId: ctx.user.id,
      createdTime: new Date(),
      pageId: pageId,
      sectionId: sectionId,
      introductionId: introductionId,
      confirmationId: confirmationId,
      replies: [],
    };

    const pageComments = questionnaireComments.comments[id];

    if (pageComments) {
      questionnaireComments.comments[id].push(newComment);
    } else {
      questionnaireComments.comments[id] = [newComment];
    }

    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, input);

    console.log(
      "\n\n comment.js/createComment - newComment return :",
      newComment
    );
    return newComment;
  },
};

module.exports = { Resolvers };
