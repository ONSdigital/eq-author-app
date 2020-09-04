const { find, findIndex, merge, some, takeRightWhile } = require("lodash");
const { getName } = require("../../../utils/getName");
const { v4: uuidv4 } = require("uuid");

const { getPageById, getSectionByPageId } = require("../utils");
const { createMutation } = require("../createMutation");

const {
  ROUTING_ANSWER_TYPES,
} = require("../../../constants/routingAnswerTypes");

const getPreviousAnswersForPage = require("../../../src/businessLogic/getPreviousAnswersForPage");
const Resolvers = {};

const createQuestionPage = (input = {}) => ({
  id: uuidv4(),
  pageType: "QuestionPage",
  title: "",
  description: "",
  descriptionEnabled: false,
  guidanceEnabled: false,
  definitionEnabled: false,
  additionalInfoEnabled: false,
  answers: [],
  routing: null,
  alias: null,
  ...input,
});

Resolvers.QuestionPage = {
  section: ({ id }, input, ctx) => getSectionByPageId(ctx, id),
  position: ({ id }, args, ctx) => {
    const section = getSectionByPageId(ctx, id);
    return findIndex(section.pages, { id });
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
    const section = find(ctx.questionnaire.sections, section => {
      if (section.pages && some(section.pages, { id })) {
        return section;
      }
    });

    const pages = takeRightWhile(section.pages, page => page.id !== id);
    const sections = takeRightWhile(
      ctx.questionnaire.sections,
      futureSection => futureSection.id !== section.id
    );

    const logicalDestinations = [
      {
        logicalDestination: "NextPage",
      },
      {
        logicalDestination: "EndOfQuestionnaire",
      },
    ];

    return {
      logicalDestinations,
      sections,
      pages,
    };
  },
  validationErrorInfo: ({ id }, args, ctx) => {
    const pageErrors = ctx.validationErrorInfo.filter(
      ({ pageId }) => id === pageId
    );

    if (!pageErrors) {
      return ({ id, errors: [], totalCount: 0 });
    }

    return ({ id, errors: pageErrors, totalCount: pageErrors.length });
  },
};

Resolvers.Mutation = {
  createQuestionPage: createMutation(
    (root, { input: { position, ...pageInput } }, ctx) => {
      const section = find(ctx.questionnaire.sections, {
        id: pageInput.sectionId,
      });
      const page = createQuestionPage(pageInput);
      const insertionPosition =
        typeof position === "number" ? position : section.pages.length;
      section.pages.splice(insertionPosition, 0, page);
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
