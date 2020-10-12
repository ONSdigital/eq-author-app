const { findIndex, merge } = require("lodash");

const { getName } = require("../../../utils/getName");

const {
  getPagesFromSection,
  getPageById,
  getSectionByPageId,
  getFolderById,
  getFoldersBySectionId,
  returnValidationErrors,
  createFolder,
  createQuestionPage,
} = require("../utils");
const { createMutation } = require("../createMutation");

const {
  ROUTING_ANSWER_TYPES,
} = require("../../../constants/routingAnswerTypes");

const availableRoutingDestinations = require("../../../src/businessLogic/availableRoutingDestinations");
const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const Resolvers = {};

Resolvers.QuestionPage = {
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    // console.log('do I fire?')
    const section = getSectionByPageId(ctx, id);
    // console.log('do I fire?', section)
    return findIndex(getPagesFromSection(section), { id });
  },
  displayName: page => getName(page, "QuestionPage"),
  availablePipingAnswers: ({ id }, args, ctx) =>
    getPreviousAnswersForPage(ctx.questionnaire, id),
  availablePipingMetadata: (page, args, ctx) => ctx.questionnaire.metadata,
  availableRoutingAnswers: (page, args, ctx) =>
    getPreviousAnswersForPage(
      ctx.questionnaire,
      page.id,
      true,
      ROUTING_ANSWER_TYPES
    ),
  availableRoutingDestinations: ({ id }, args, ctx) => {
    // will need to double check this
    const {
      logicalDestinations,
      sections,
      questionPages,
    } = availableRoutingDestinations(ctx, id);

    return {
      logicalDestinations,
      sections,
      pages: questionPages,
    };
  },
  validationErrorInfo: ({ id }, args, ctx) =>
    returnValidationErrors(ctx, id, ({ pageId }) => id === pageId),
};

Resolvers.Mutation = {
  createQuestionPage: createMutation(
    (root, { input: { position, ...pageInput } }, ctx) => {
      // Both of these branches return page to satisfy type defs
      if (pageInput.folderId) {
        const folder = getFolderById(ctx, pageInput.folderId);
        const page = createQuestionPage(pageInput);
        const insertionPosition =
          typeof position === "number" ? position : folder.pages.length;
        folder.pages.splice(insertionPosition, 0, page);
        return page;
      } else {
        const folders = getFoldersBySectionId(ctx, pageInput.sectionId);
        const page = createQuestionPage(pageInput);
        const folder = createFolder(page);
        folders.push(folder);
        return page;
      }
    }
  ),
  updateQuestionPage: createMutation((_, { input }, ctx) => {
    const page = getPageById(ctx, input.id);
    merge(page, input);
    return page;
  }),
};

module.exports = { Resolvers, createQuestionPage };
