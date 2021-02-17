const { merge } = require("lodash");

const { getName } = require("../../../utils/getName");

const {
  getPageById,
  getSectionByPageId,
  getFolderById,
  getFoldersBySectionId,
  createFolder,
  createQuestionPage,
  getFolderByPageId,
} = require("../utils");
const { createMutation } = require("../createMutation");

const availableRoutingDestinations = require("../../../src/businessLogic/availableRoutingDestinations");
const Resolvers = {};

Resolvers.QuestionPage = {
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  folder: ({ id }, args, ctx) => getFolderByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    const folder = getFolderByPageId(ctx, id);
    return folder.pages.findIndex((page) => page.id === id);
  },
  displayName: (page) => getName(page, "QuestionPage"),
  availableRoutingDestinations: ({ id }, args, ctx) => {
    const {
      logicalDestinations,
      sections,
      questionPages,
    } = availableRoutingDestinations(ctx.questionnaire, id);

    return {
      logicalDestinations,
      sections,
      pages: questionPages,
    };
  },
  validationErrorInfo: ({ id }, args, ctx) => {
    const pageErrors = ctx.validationErrorInfo.filter(
      ({ pageId, type }) => id === pageId && !type.startsWith("confirmation")
    );

    return {
      id,
      errors: pageErrors,
      totalCount: pageErrors.length,
    };
  },
};

Resolvers.Mutation = {
  createQuestionPage: createMutation(
    (root, { input: { position, ...pageInput } }, ctx) => {
      const page = createQuestionPage(pageInput);
      const { folderId, sectionId } = pageInput;

      if (folderId) {
        const folder = getFolderById(ctx, folderId);
        const insertPosition = position > -1 ? position : folder.pages.length;
        folder.pages.splice(insertPosition, 0, page);
      } else {
        const folders = getFoldersBySectionId(ctx, sectionId);
        const insertPosition = position > -1 ? position : folders.length;
        const folder = createFolder({ pages: [page] });
        folders.splice(insertPosition, 0, folder);
      }

      return page;
    }
  ),
  updateQuestionPage: createMutation((_, { input }, ctx) => {
    const page = getPageById(ctx, input.id);
    merge(page, input);
    return page;
  }),
};

module.exports = { Resolvers, createQuestionPage };
