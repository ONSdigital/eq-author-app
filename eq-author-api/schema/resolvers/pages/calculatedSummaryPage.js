const { merge, uniq, get, intersection } = require("lodash");

const { getName } = require("../../../utils/getName");
const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");

const {
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  UNIT,
} = require("../../../constants/answerTypes");

const { createMutation } = require("../createMutation");
const {
  getPageById,
  getAnswerById,
  getFolderById,
  getSectionByPageId,
  returnValidationErrors,
  getFolderByPageId,
} = require("../utils/utils");

const { createCalculatedSummary } = require("../../../src/businessLogic");

const Resolvers = {};

Resolvers.CalculatedSummaryPage = {
  displayName: (page) => getName(page, "CalculatedSummaryPage"),
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  folder: ({ id }, args, ctx) => getFolderByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    const folder = getFolderByPageId(ctx, id);
    return folder.pages.findIndex((page) => page.id === id);
  },
  summaryAnswers: ({ id, summaryAnswers }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    const previousAnswers = getPreviousAnswersForPage(
      { sections: [section] },
      id,
      true,
      [NUMBER, CURRENCY, PERCENTAGE, UNIT]
    ).map(({ id }) => id);
    const validSummaryAnswers = intersection(previousAnswers, summaryAnswers);
    return validSummaryAnswers
      ? validSummaryAnswers.map((validSummaryAnswer) =>
          getAnswerById(ctx, validSummaryAnswer)
        )
      : [];
  },

  validationErrorInfo: ({ id }, args, ctx) =>
    returnValidationErrors(ctx, id, ({ pageId }) => id === pageId),
};

Resolvers.Mutation = {
  createCalculatedSummaryPage: createMutation(
    (root, { input: { position, sectionId, folderId } }, ctx) => {
      const page = createCalculatedSummary({ sectionId });
      const folder = getFolderById(ctx, folderId);
      folder.pages.splice(position, 0, page);

      return page;
    }
  ),
  updateCalculatedSummaryPage: createMutation((_, { input }, ctx) => {
    const page = getPageById(ctx, input.id);
    if (get(input, "summaryAnswers", []).length > 0) {
      const answerTypes = input.summaryAnswers.map((summaryAnswerId) => {
        const answerType = getAnswerById(ctx, summaryAnswerId).type;
        if (![NUMBER, CURRENCY, PERCENTAGE, UNIT].includes(answerType)) {
          throw new Error(
            `${answerType} answers are not suitable for a calculated summary page`
          );
        }
        return answerType;
      });
      if (uniq(answerTypes).length > 1) {
        throw new Error(
          "Answer types must be consistent on a calculated summary"
        );
      }
    }

    merge(page, input);
    page.summaryAnswers = input.summaryAnswers;
    return page;
  }),
};

module.exports = { Resolvers, createCalculatedSummary };
