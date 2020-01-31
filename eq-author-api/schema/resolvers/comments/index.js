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
  __resolveType(commentPage) {
    if (commentPage.page) {
      console.log("commentPage--------PAGE", commentPage);
    }

    if (commentPage.section) {
      console.log("commentPage--------SECTION", commentPage);
    }
  },
  page: ({ pageId, sectionId }, args, ctx) => {
    console.log("\nComments RESOLVER - pageId -----=------:", pageId);
    console.log("\nComments RESOLVER - sectionId -----=------:", sectionId);

    if (sectionId) {
      const temp = getSectionById(ctx, sectionId);
      console.log("\n----Comments RESOLVER getSectionById-------", temp);
      return temp;
    }
    if (pageId) {
      const temp = getPageById(ctx, pageId);
      console.log("\n----Comments RESOLVER getPageById-------", temp);
      return temp;
    }
    // return getPageById(ctx, pageId);
  },
  section: ({ pageId }, args, ctx) => {
    const temp = getSectionById(ctx, pageId);

    console.log("\n\nSECTION_____________", pageId);
    return temp;
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
