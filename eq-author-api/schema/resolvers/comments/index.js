const {
  getPageById,
  getSectionById,
  getIntroductionById,
  getConfirmationById,
} = require("../utils");

const { getUserById } = require("../../../utils/datastore");

const Resolvers = {};

const { getCommentsForQuestionnaire } = require("../../../utils/datastore");

Resolvers.DeleteResponse = {
  page: ({ pageId }, args, ctx) => {
    if (pageId) {
      return getPageById(ctx, pageId);
    }
  },
  section: ({ sectionId }, args, ctx) => {
    if (sectionId) {
      return getSectionById(ctx, sectionId);
    }
  },
  questionnaireIntroduction: ({ introductionId }, args, ctx) => {
    if (introductionId) {
      return getIntroductionById(ctx, introductionId);
    }
  },
  confirmationPage: ({ confirmationId }, args, ctx) => {
    if (confirmationId) {
      return getConfirmationById(ctx, confirmationId);
    }
  },
};

Resolvers.Comment = {
  user: ({ userId }) => getUserById(userId),
  page: ({ pageId }, args, ctx) => {
    if (pageId) {
      return getPageById(ctx, pageId);
    }
  },
  section: ({ sectionId }, args, ctx) => {
    if (sectionId) {
      return getSectionById(ctx, sectionId);
    }
  },
  questionnaireIntroduction: ({ introductionId }, args, ctx) => {
    if (introductionId) {
      return getIntroductionById(ctx, introductionId);
    }
  },
  confirmationPage: ({ confirmationId }, args, ctx) => {
    if (confirmationId) {
      return getConfirmationById(ctx, confirmationId);
    }
  },
};

Resolvers.Reply = {
  user: ({ userId }) => getUserById(userId),
  parentComment: async ({ parentCommentId, parentPageId }, args, ctx) => {
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const parentComment = questionnaireComments.comments[parentPageId].find(
      ({ id }) => id === parentCommentId
    );

    return parentComment;
  },
};

module.exports = [
  Resolvers,
  require("./comment").Resolvers,
  require("./reply").Resolvers,
];
