const { merge } = require("lodash");

const { getName } = require("../../../utils/getName");

const {
  getPageById,
  getSectionByPageId,
  getFolderById,
  createQuestionPage,
  getFolderByPageId,
} = require("../utils");
const { createMutation } = require("../createMutation");

const Resolvers = {};

Resolvers.QuestionPage = {
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  folder: ({ id }, args, ctx) => getFolderByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    const folder = getFolderByPageId(ctx, id);
    return folder.pages.findIndex((page) => page.id === id);
  },
  displayName: (page) => getName(page, "QuestionPage"),
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
      const { folderId } = pageInput;
      const folder = getFolderById(ctx, folderId);
      folder.pages.splice(position, 0, page);
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
