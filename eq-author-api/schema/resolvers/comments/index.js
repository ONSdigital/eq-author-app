const { getPageById, getSectionById } = require("../utils");
const pubsub = require("../../../db/pubSub");

const { getUserById } = require("../../../utils/datastore");

const Resolvers = {};

const { getCommentsForQuestionnaire } = require("../../../utils/datastore");

const publishCommentUpdates = (questionnaire, pageId) => {
  pubsub.publish("commentsUpdated", {
    questionnaire,
    pageId,
  });
};

Resolvers.Comment = {
  user: ({ userId }) => getUserById(userId),
  page: ({ pageId, sectionId }, args, ctx) => {
    console.log("RESOLVER - pageId -----=------:", pageId);

    console.log("RESOLVER - sectionId -----=------:", sectionId);
    if (sectionId) {
      return getSectionById(ctx, sectionId);
    }
    const temp = getPageById(ctx, pageId);

    console.log("----RESOLVER getPageById-------", temp);
    return temp;
    // return getPageById(ctx, pageId);
  },
};

Resolvers.Reply = {
  user: ({ userId }) => getUserById(userId),
  page: async ({ pageId }, args, ctx) => {
    await getPageById(ctx, pageId);
  },
  parentComment: async ({ parentCommentId, pageId }, args, ctx) => {
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const parentComment = questionnaireComments.comments[pageId].find(
      ({ id }) => id === parentCommentId
    );

    return parentComment;
  },
};

module.exports = [
  Resolvers,
  publishCommentUpdates,
  require("./comment").Resolvers,
  require("./reply").Resolvers,
];
