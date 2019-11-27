const pubsub = require("../../../db/pubSub");
const { find, findIndex, remove, omit, set, first } = require("lodash");
const uuid = require("uuid");

const {
  getSectionByPageId,
  remapAllNestedIds,
  getPageById,
} = require("../utils");

const onPageDeleted = require("../../../src/businessLogic/onPageDeleted");
const { createMutation } = require("../createMutation");
const addPrefix = require("../../../utils/addPrefix");
const { createQuestionPage } = require("./questionPage");

const {
  getCommentsForQuestionnaire,
  saveComments,
  getUserById,
} = require("../../../utils/datastore");

const publishCommentUpdates = (questionnaire, pageId) => {
  pubsub.publish("commentsUpdated", {
    questionnaire,
    pageId,
  });
};

const Resolvers = {};

Resolvers.Page = {
  __resolveType: ({ pageType }) => pageType,
  position: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    return findIndex(section.pages, { id });
  },
};

Resolvers.Comment = {
  user: ({ userId }) => getUserById(userId),
  page: ({ pageId }, args, ctx) => getPageById(ctx, pageId),
};

Resolvers.Mutation = {
  movePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const removedPage = first(remove(section.pages, { id: input.id }));
    if (input.sectionId === section.id) {
      section.pages.splice(input.position, 0, removedPage);
    } else {
      const newsection = find(ctx.questionnaire.sections, {
        id: input.sectionId,
      });
      newsection.pages.splice(input.position, 0, removedPage);
    }
    return removedPage;
  }),
  deletePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    remove(section.pages, { id: input.id });
    onPageDeleted(ctx, input.id);
    return section;
  }),

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
    const { pageId } = input;
    const questionnaire = ctx.questionnaire;
    const questionnaireComments = await getCommentsForQuestionnaire(
      questionnaire.id
    );

    const pageComments = questionnaireComments.comments[pageId];

    if (pageComments) {
      remove(pageComments, ({ id }) => id === input.commentId);
      await saveComments(questionnaireComments);
    }
    publishCommentUpdates(questionnaire, pageId);

    const page = getPageById(ctx, pageId);
    return page;
  },

  createComment: async (_, { input }, ctx) => {
    const { pageId } = input;
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
      replies: [],
    };

    if (questionnaireComments.comments[pageId]) {
      questionnaireComments.comments[pageId].push(newComment);
    } else {
      questionnaireComments.comments[pageId] = [newComment];
    }
    await saveComments(questionnaireComments);

    publishCommentUpdates(questionnaire, pageId);

    return newComment;
  },

  duplicatePage: createMutation((_, { input }, ctx) => {
    const section = getSectionByPageId(ctx, input.id);
    const page = find(section.pages, { id: input.id });
    const newpage = omit(page, "id");
    set(newpage, "alias", addPrefix(newpage.alias));
    set(newpage, "title", addPrefix(newpage.title));
    const duplicatedPage = createQuestionPage(newpage);
    const remappedPage = remapAllNestedIds(duplicatedPage);
    section.pages.splice(input.position, 0, remappedPage);
    return remappedPage;
  }),
};

module.exports = [
  Resolvers,
  require("./questionPage").Resolvers,
  require("./calculatedSummaryPage").Resolvers,
];
