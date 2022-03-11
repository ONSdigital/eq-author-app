const { merge, omit } = require("lodash");

const { getName } = require("../../../utils/getName");

const {
  getPageById,
  getSectionByPageId,
  getFolderById,
  getFolderByPageId,
} = require("../utils");

const { createListCollectionPage } = require("../../../src/businessLogic");

const { createMutation } = require("../createMutation");

const Resolvers = {};

Resolvers.listCollectionPage = {
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  folder: ({ id }, args, ctx) => getFolderByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    const folder = getFolderByPageId(ctx, id);
    return folder.pages.findIndex((page) => page.id === id);
  },
  displayName: (page) => getName(page, "ListCollectionPage"),
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
  createListCollectionPage: createMutation(
    (root, { input: { position, ...pageInput } }, ctx) => {
      const page = createListCollectionPage(pageInput);
      const { folderId } = pageInput;
      const folder = getFolderById(ctx, folderId);
      folder.pages.splice(position, 0, page);
      return page;
    }
  ),
  updateQuestionPage: createMutation((_, { input }, ctx) => {
    const page = getPageById(ctx, input.id);

    merge(page, omit(input, "folderId"));

    return page;
  }),
};

module.exports = { Resolvers, createListCollectionPage };
