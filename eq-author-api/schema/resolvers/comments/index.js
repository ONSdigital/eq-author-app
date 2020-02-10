const {
  getPageById,
  getSectionById,
  getIntroductionById,
  getConfirmationById,
} = require("../utils");
const pubsub = require("../../../db/pubSub");

const { getUserById } = require("../../../utils/datastore");

const Resolvers = {};

const { getCommentsForQuestionnaire } = require("../../../utils/datastore");

const publishCommentUpdates = (questionnaire, pageId) => {
  console.log("\n\n\n\n\nINDEX.JS/publishCommentUpdates ---- pageId", pageId);

  pubsub.publish("commentsUpdated", {
    questionnaire,
    pageId,
  });
};

Resolvers.DeleteResponse = {
  page: ({ pageId }, args, ctx) => {
    if (pageId) {
      const temp = getPageById(ctx, pageId);
      console.log(
        "\npage return - Resolvers.DeleteResponse getPageById-------",
        temp
      );
      return getPageById(ctx, pageId);
    }
  },
  section: ({ sectionId }, args, ctx) => {
    if (sectionId) {
      const temp = getSectionById(ctx, sectionId);

      console.log(
        "\n\nsection - Resolvers.DeleteResponse getSectionById------",
        temp
      );
      return getSectionById(ctx, sectionId);
    }
  },
  questionnaireIntroduction: ({ introductionId }, args, ctx) => {
    if (introductionId) {
      const temp = getIntroductionById(ctx, introductionId);
      console.log(
        "\n\nIntroduction - Resolvers.DeleteResponse getIntroductionById------",
        temp
      );
      return getIntroductionById(ctx, introductionId);
    }
  },
  confirmationPage: ({ confirmationId }, args, ctx) => {
    if (confirmationId) {
      const temp = getConfirmationById(ctx, confirmationId);

      console.log(
        "\n\nsection - Resolvers.DeleteResponse getSectionById------",
        temp
      );
      return getConfirmationById(ctx, confirmationId);
    }
  },
};

Resolvers.Comment = {
  user: ({ userId }) => getUserById(userId),
  page: ({ pageId }, args, ctx) => {
    if (pageId) {
      console.log(
        "\nindex.js/Resolvers.Comment - page return (getPageById)-------",
        getPageById(ctx, pageId)
      );
      return getPageById(ctx, pageId);
    }
  },
  section: ({ sectionId }, args, ctx) => {
    if (sectionId) {
      console.log(
        "\n\nsection return - Resolvers.Comment get sectionById------",
        getSectionById(ctx, sectionId)
      );
      return getSectionById(ctx, sectionId);
    }
  },
  questionnaireIntroduction: ({ introductionId }, args, ctx) => {
    if (introductionId) {
      console.log(
        "\n\nindex.js/Resolvers.Comment-Introduction return ------",
        getIntroductionById(ctx, introductionId)
      );
      return getIntroductionById(ctx, introductionId);
    }
  },
  confirmationPage: ({ confirmationId }, args, ctx) => {
    if (confirmationId) {
      console.log(
        "\n\nindex.js/Resolvers.Comment-confirmationPage return ------",
        getConfirmationById(ctx, confirmationId)
      );
      return getConfirmationById(ctx, confirmationId);
    }
  },
};

Resolvers.Reply = {
  user: ({ userId }) => getUserById(userId),
  //   page: async ({ pageId }, args, ctx) => {
  //     console.log(
  //       "\n\nindex.js/Resolvers.Reply - getPageById(ctx, pageId)",
  //       getPageById(ctx, pageId)
  //     );
  //     await getPageById(ctx, pageId);
  //   },
  parentComment: async ({ parentCommentId, parentPageId }, args, ctx) => {
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const parentComment = questionnaireComments.comments[parentPageId].find(
      ({ id }) => id === parentCommentId
    );

    console.log(
      "\n\nindex.js/Resolvers.Reply.parentComment - **** - parentComment return",
      parentComment
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
