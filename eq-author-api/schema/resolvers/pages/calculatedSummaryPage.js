const { merge, uniq, get } = require("lodash");

const { getName } = require("../../../utils/getName");

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
} = require("../utils");

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
  summaryAnswers: ({ summaryAnswers }, args, ctx) => {
    const arr = [];

    if (summaryAnswers) {
      summaryAnswers.forEach((id) => {
        const ans = getAnswerById(ctx, id);

        if (ans !== undefined) {
          arr.push(ans);
        }
      });
    }

    return arr;
  },

  validationErrorInfo: ({ id }, args, ctx) =>
    returnValidationErrors(ctx, id, ({ pageId }) => id === pageId),
  comments: ({ id }, args, ctx) => ctx.comments[id],
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
    page.answers[0].label = page.totalTitle;
    page.answers[0].type = page.type;
    page.summaryAnswers = input.summaryAnswers;
    return page;
  }),
};

module.exports = { Resolvers, createCalculatedSummary };
