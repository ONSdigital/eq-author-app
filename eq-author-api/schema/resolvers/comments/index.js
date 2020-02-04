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

Resolvers.DeletedComment = {
  page: ({ pageId }, args, ctx) => {
    console.log("\nPage - Resolvers.comment - pageId -----=------:", pageId);

    if (pageId) {
      const temp = getPageById(ctx, pageId);
      console.log(
        "\npage return - Resolvers.DeletedComment getPageById-------",
        temp
      );
      return getPageById(ctx, pageId);
    }
  },
  section: ({ sectionId }, args, ctx) => {
    if (sectionId) {
      const temp = getSectionById(ctx, sectionId);

      console.log(
        "\n\nsection return - Resolvers.DeletedComment get sectionById------",
        temp
      );
      return getSectionById(ctx, sectionId);
    }
  },
};

Resolvers.Comment = {
  user: ({ userId }) => getUserById(userId),
  //   __resolveType(commentPage) {
  //     if (commentPage.page) {
  //       console.log("commentPage--------PAGE", commentPage);
  //     }

  //     if (commentPage.section) {
  //       console.log("commentPage--------SECTION", commentPage);
  //     }
  //   },
  page: ({ pageId }, args, ctx) => {
    console.log("\nPage - Resolvers.comment - pageId -----=------:", pageId);

    if (pageId) {
      const temp = getPageById(ctx, pageId);
      console.log("\npage return - Resolvers.comment getPageById-------", temp);
      return getPageById(ctx, pageId);
    }
  },
  section: ({ sectionId }, args, ctx) => {
    if (sectionId) {
      const temp = getSectionById(ctx, sectionId);

      console.log(
        "\n\nsection return - Resolvers.Comment get sectionById------",
        temp
      );
      return getSectionById(ctx, sectionId);
    }
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
