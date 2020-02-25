const { find, findIndex, merge, uniq, get, intersection } = require("lodash");
const uuid = require("uuid");

const { getName } = require("../../../utils/getName");
const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");

const {
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  UNIT,
} = require("../../../constants/answerTypes");

const { createMutation } = require("../createMutation");
const { getPageById, getAnswerById, getSectionByPageId } = require("../utils");
const { PAGES } = require("../../../constants/validationErrorTypes");

const createCalculatedSummary = (input = {}) => ({
  id: uuid.v4(),
  title: "",
  pageType: "CalculatedSummaryPage",
  summaryAnswers: [],
  ...input,
});

const Resolvers = {};

Resolvers.CalculatedSummaryPage = {
  displayName: page => getName(page, "CalculatedSummaryPage"),
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    return findIndex(section.pages, { id });
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
      ? validSummaryAnswers.map(validSummaryAnswer =>
          getAnswerById(ctx, validSummaryAnswer)
        )
      : [];
  },

  availableSummaryAnswers: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);

    return getPreviousAnswersForPage({ sections: [section] }, id, true, [
      NUMBER,
      CURRENCY,
      PERCENTAGE,
      UNIT,
    ]);
  },
  availablePipingAnswers: ({ id }, args, ctx) =>
    getPreviousAnswersForPage(ctx.questionnaire, id),
  availablePipingMetadata: (page, args, ctx) => ctx.questionnaire.metadata,
  validationErrorInfo: ({ id }, args, ctx) =>
    ctx.validationErrorInfo[PAGES][id] || { id, errors: [], totalCount: 0 },
};

Resolvers.Mutation = {
  createCalculatedSummaryPage: createMutation(
    (root, { input: { position, sectionId } }, ctx) => {
      const section = find(ctx.questionnaire.sections, {
        id: sectionId,
      });
      const page = createCalculatedSummary({ sectionId });
      const insertionPosition =
        typeof position === "number" ? position : section.pages.length;
      section.pages.splice(insertionPosition, 0, page);
      return page;
    }
  ),
  updateCalculatedSummaryPage: createMutation((_, { input }, ctx) => {
    const page = getPageById(ctx, input.id);
    if (get(input, "summaryAnswers", []).length > 0) {
      const answerTypes = input.summaryAnswers.map(summaryAnswerId => {
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
