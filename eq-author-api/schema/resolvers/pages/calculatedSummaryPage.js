const {
  compact,
  find,
  findIndex,
  merge,
  uniq,
  get,
  intersection,
} = require("lodash");
const uuid = require("uuid");

const { getName } = require("../../../utils/getName");
const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const {
  NUMBER,
  CURRENCY,
  PERCENTAGE,
} = require("../../../constants/answerTypes");
const { saveQuestionnaire } = require("../../../utils/datastore");

const { getPageById, getAnswerById, getSectionByPageId } = require("../utils");

const createCalculatedSummary = (input = {}) => ({
  id: uuid.v4(),
  title: "",
  pageType: "CalculatedSummaryPage",
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
      [NUMBER, CURRENCY, PERCENTAGE]
    ).map(({ id }) => id);
    const validSummaryAnswers = intersection(previousAnswers, summaryAnswers);
    return validSummaryAnswers
      ? validSummaryAnswers.map(validSummaryAnswer =>
          getAnswerById(ctx, validSummaryAnswer)
        )
      : [];
  },
  availableSummaryAnswers: ({ id, summaryAnswers }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    if (!summaryAnswers || summaryAnswers.length === 0) {
      return getPreviousAnswersForPage({ sections: [section] }, id, true, [
        NUMBER,
        CURRENCY,
        PERCENTAGE,
      ]);
    }

    const answerTypes = summaryAnswers.map(selectedSummaryAnswer =>
      get(getAnswerById(ctx, selectedSummaryAnswer), "type")
    );
    const uniqueAnswerTypes = uniq(compact(answerTypes));
    if (uniqueAnswerTypes.length > 1) {
      throw new Error(`All answer types must be consistent.`);
    }
    const previousAnswers = getPreviousAnswersForPage(
      { sections: [section] },
      id,
      true,
      [uniqueAnswerTypes[0]]
    );
    return previousAnswers.filter(
      previousAnswer => !summaryAnswers.includes(previousAnswer.id)
    );
  },
  availablePipingAnswers: ({ id }, args, ctx) =>
    getPreviousAnswersForPage(ctx.questionnaire, id),
  availablePipingMetadata: (page, args, ctx) => ctx.questionnaire.metadata,
};

Resolvers.Mutation = {
  createCalculatedSummaryPage: async (
    root,
    { input: { position, sectionId } },
    ctx
  ) => {
    const section = find(ctx.questionnaire.sections, {
      id: sectionId,
    });
    const page = createCalculatedSummary({ sectionId });
    const insertionPosition =
      typeof position === "number" ? position : section.pages.length;
    section.pages.splice(insertionPosition, 0, page);
    await saveQuestionnaire(ctx.questionnaire);
    return page;
  },
  updateCalculatedSummaryPage: async (_, { input }, ctx) => {
    const page = getPageById(ctx, input.id);
    let currentSelectedAnswerType;
    if (get(page, "summaryAnswers", []).length > 0) {
      currentSelectedAnswerType = page.summaryAnswers
        ? getAnswerById(ctx, page.summaryAnswers[0]).type
        : null;
    }
    if (get(input, "summaryAnswers", []).length > 0) {
      input.summaryAnswers.forEach(summaryAnswerId => {
        const answerType = getAnswerById(ctx, summaryAnswerId).type;
        if (![NUMBER, CURRENCY, PERCENTAGE].includes(answerType)) {
          throw new Error(
            `${answerType} answers are not suitable for a calculated summary page`
          );
        }
        if (
          currentSelectedAnswerType &&
          answerType !== currentSelectedAnswerType
        ) {
          throw new Error(
            "Answer types must be consistent on a calculated summary"
          );
        }
      });
    }

    merge(page, input);
    page.summaryAnswers = input.summaryAnswers;
    await saveQuestionnaire(ctx.questionnaire);
    return page;
  },
};

module.exports = Resolvers;
