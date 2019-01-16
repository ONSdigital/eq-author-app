const { GraphQLDate } = require("graphql-iso-date");
const {
  includes,
  isNil,
  pick,
  find,
  findIndex,
  merge,
  remove,
  flatMap,
  omit,
  set,
  cloneDeep,
} = require("lodash");
const GraphQLJSON = require("graphql-type-json");
const { getName } = require("../../utils/getName");
const formatRichText = require("../../utils/formatRichText");
const {
  getValidationEntity,
} = require("../../repositories/strategies/validationStrategy");
const fs = require("fs");
const uuid = require("uuid");
const stringify = require("json-stable-stringify");

const createAnswer = require("../../src/businessLogic/createAnswer");
const addPrefix = require("../../utils/addPrefix");

const getSection = ctx => input => {
  return find(ctx.questionnaire.sections, { id: input.sectionId });
};

const getPage = ctx => input => {
  const pages = flatMap(ctx.questionnaire.sections, section => section.pages);
  return find(pages, { id: input.pageId });
};

const getAnswer = ctx => input => {
  const answers = flatMap(ctx.questionnaire.sections, section =>
    flatMap(section.pages, page => page.answers)
  );
  return find(answers, { id: input.answerId });
};

const getOption = ctx => input => {
  const options = flatMap(ctx.questionnaire.sections, section =>
    flatMap(section.pages, page =>
      flatMap(page.answers, answer => answer.options)
    )
  );
  return find(options, { id: input.optionId });
};

const findSectionByPageId = (sections, id) =>
  find(sections, section => find(section.pages, { id }));

const createPage = (input = {}) => ({
  id: uuid.v4(),
  pageType: "QuestionPage",
  title: "",
  description: "",
  answers: [],
  ...input,
});

const createSection = (input = {}) => ({
  id: uuid.v4(),
  title: "",
  introductionEnabled: false,
  pages: [createPage()],
  ...input,
});

const createQuestionnaire = input => ({
  id: uuid.v4(),
  title: null,
  description: null,
  theme: "default",
  legalBasis: "Voluntary",
  navigation: false,
  surveyId: "",
  createdAt: new Date(),
  metadata: [],
  sections: [createSection()],
  ...input,
});

const save = questionnaire => {
  fs.writeFileSync(
    `data/${questionnaire.id}.json`,
    stringify(questionnaire, { space: 4 })
  );
  return questionnaire;
};

const Resolvers = {
  Query: {
    questionnaires: (root, args, ctx) =>
      ctx.repositories.Questionnaire.findAll(),
    questionnaire: (root, args, ctx) => ctx.questionnaire,
    section: (root, { input }, ctx) => getSection(ctx)(input),
    page: (root, { input }, ctx) => getPage(ctx)(input),
    questionPage: (root, { input }, ctx) => getPage(ctx)(input),
    answer: (root, { input }, ctx) => getAnswer(ctx)(input),
    answers: async (root, { ids }, ctx) =>
      ctx.repositories.Answer.getAnswers(ids), // TODO
    option: (root, { input }, ctx) => getOption(ctx)(input),
    availableRoutingDestinations: (root, { pageId }, ctx) =>
      ctx.repositories.Routing.getRoutingDestinations(pageId),
    questionConfirmation: (root, { id }, ctx) =>
      ctx.repositories.QuestionConfirmation.findById(id),
    me: (root, args, ctx) => ({
      id: ctx.auth.sub,
      ...pick(ctx.auth, ["name", "email", "picture"]),
    }),
  },

  Mutation: {
    createQuestionnaire: async (root, args, ctx) => {
      const questionnaire = createQuestionnaire({
        ...args.input,
        createdBy: ctx.auth.name,
      });
      return save(questionnaire);
    },
    updateQuestionnaire: (_, { input }, ctx) => {
      return save({
        ...ctx.questionnaire,
        ...input,
      });
    },
    deleteQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.remove(args.input.id),
    undeleteQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.undelete(args.input.id),
    duplicateQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.duplicate(args.input.id, ctx.auth.name),

    createSection: async (root, { input }, ctx) => {
      const section = createSection(input);
      ctx.questionnaire.sections.push(section);
      save(ctx.questionnaire);
      return section;
    },
    updateSection: (_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      merge(section, input);
      save(ctx.questionnaire);
      return section;
    },
    deleteSection: (root, { input }, ctx) => {
      return remove(ctx.questionnaire.sections, { id: input.sectionId });
    },
    undeleteSection: (_, args, ctx) =>
      ctx.repositories.Section.undelete(args.input.id), // TODO
    moveSection: (_, args, ctx) => ctx.repositories.Section.move(args.input),

    duplicateSection: (_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      const newSection = omit(cloneDeep(section), "id");
      set(newSection, "alias", addPrefix(newSection.alias));
      set(newSection, "title", addPrefix(newSection.title));
      const duplicatedSection = createSection(newSection);
      duplicatedSection.pages.map(page => set(page, "id", uuid.v4()));
      ctx.questionnaire.sections.splice(input.position, 0, duplicatedSection);
      save(ctx.questionnaire);
      return duplicatedSection;
    },

    createPage: (root, { input }, ctx) => {
      const section = find(ctx.questionnaire.section, { id: input.sectionId });
      const page = createPage();
      section.pages.push(page);
      save(ctx.questionnaire);
      return page;
    },

    updatePage: (_, { input }, ctx) => {
      const page = getPage(ctx, { id: input.id });
      merge(page, input);
      save(ctx.questionnaire);
      return page;
    },
    deletePage: (_, { input }, ctx) => {
      const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
      const page = find(section.pages, { id: input.id });
      const removedPage = remove(section.pages, { id: page.id });
      save(ctx.questionnaire);
      return removedPage[0];
    },
    undeletePage: (_, args, ctx) =>
      ctx.repositories.Page.undelete(args.input.id),
    movePage: (_, args, ctx) => ctx.repositories.Page.move(args.input),
    duplicatePage: (_, { input }, ctx) => {
      const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
      const page = find(section.pages, { id: input.id });
      const newpage = omit(page, "id");
      set(newpage, "alias", addPrefix(newpage.alias));
      set(newpage, "title", addPrefix(newpage.title));
      const duplicatedPage = createPage(newpage);
      section.pages.splice(input.position, 0, duplicatedPage);
      save(ctx.questionnaire);
      return duplicatedPage;
    },

    createQuestionPage: (root, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.sectionId });
      const page = createPage();
      section.pages.push(page);
      save(ctx.questionnaire);
      return page;
    },
    updateQuestionPage: (_, { input }, ctx) => {
      const page = getPage(ctx, { id: input.id });
      merge(page, input);
      save(ctx.questionnaire);
      return page;
    },
    deleteQuestionPage: (_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.sectionId });
      const page = find(section.pages, { id: input.pageId });
      const removedPage = remove(section.pages, { id: page.pageId });
      save(ctx.questionnaire);
      return removedPage[0];
    },
    undeleteQuestionPage: (_, args, ctx) =>
      ctx.repositories.QuestionPage.undelete(args.input.id),

    createAnswer: async (root, { input }, ctx) => {
      const page = getPage(ctx)({ pageId: input.questionPageId });
      const answer = createAnswer(input);
      page.answers.push(answer);
      save(ctx.questionnaire);
      // await ctx.modifiers.BinaryExpression.onAnswerCreated(answer); // TODO
      return answer;
    },
    updateAnswer: (_, args, ctx) => ctx.repositories.Answer.update(args.input),
    deleteAnswer: async (_, args, ctx) => {
      const deletedAnswer = await ctx.repositories.Answer.remove(args.input.id);
      await ctx.modifiers.BinaryExpression.onAnswerDeleted(deletedAnswer);
      return deletedAnswer;
    },
    undeleteAnswer: (_, args, ctx) =>
      ctx.repositories.Answer.undelete(args.input.id),

    createOption: async (root, args, ctx) => {
      let additionalAnswerId;
      if (args.input.hasAdditionalAnswer) {
        const additionalAnswer = await ctx.repositories.Answer.createAnswer({
          description: "",
          type: "TextField",
          parentAnswerId: args.input.answerId,
        });
        additionalAnswerId = additionalAnswer.id;
      }
      return ctx.repositories.Option.insert({
        ...args.input,
        additionalAnswerId,
      });
    },
    createMutuallyExclusiveOption: (root, { input }, ctx) =>
      ctx.repositories.Option.insert({ mutuallyExclusive: true, ...input }),
    updateOption: (_, args, ctx) => ctx.repositories.Option.update(args.input),
    deleteOption: (_, args, ctx) =>
      ctx.repositories.Option.remove(args.input.id),
    undeleteOption: (_, args, ctx) =>
      ctx.repositories.Option.undelete(args.input.id),
    createRoutingRuleSet: async (root, args, ctx) =>
      ctx.repositories.Routing.createRoutingRuleSet(args.input),
    updateRoutingRuleSet: (_, args, ctx) =>
      ctx.repositories.Routing.updateRoutingRuleSet(args.input),
    deleteRoutingRuleSet: (_, args, ctx) =>
      ctx.repositories.Routing.deleteRoutingRuleSet(args.input),
    resetRoutingRuleSetElse: (_, args, ctx) => {
      return ctx.repositories.Routing.updateRoutingRuleSet(args.input);
    },
    createRoutingRule: async (_, args, ctx) =>
      ctx.repositories.Routing.createRoutingRule(args.input),
    updateRoutingRule: (_, args, ctx) =>
      ctx.repositories.Routing.updateRoutingRule(args.input),
    deleteRoutingRule: (_, args, ctx) =>
      ctx.repositories.Routing.removeRoutingRule(args.input),
    undeleteRoutingRule: (_, args, ctx) =>
      ctx.repositories.Routing.undeleteRoutingRule(args.input),
    createRoutingCondition: (_, args, ctx) =>
      ctx.repositories.Routing.createRoutingCondition(args.input),
    updateRoutingCondition: (_, args, ctx) =>
      ctx.repositories.Routing.updateRoutingCondition(args.input),
    deleteRoutingCondition: (_, args, ctx) =>
      ctx.repositories.Routing.removeRoutingCondition(args.input),
    toggleConditionOption: async (_, args, ctx) =>
      ctx.repositories.Routing.toggleConditionOption(args.input),
    createConditionValue: async (_, args, ctx) =>
      ctx.repositories.Routing.createConditionValue(args.input),
    updateConditionValue: async (_, args, ctx) =>
      ctx.repositories.Routing.updateConditionValue(args.input),
    toggleValidationRule: (_, args, ctx) =>
      ctx.repositories.Validation.toggleValidationRule(args.input),
    updateValidationRule: (_, args, ctx) =>
      ctx.repositories.Validation.updateValidationRule(args.input),
    createMetadata: (root, args, ctx) =>
      ctx.repositories.Metadata.insert(args.input),
    updateMetadata: (_, args, ctx) =>
      ctx.repositories.Metadata.update(args.input),
    deleteMetadata: (_, args, ctx) =>
      ctx.repositories.Metadata.remove(args.input.id),

    createQuestionConfirmation: (_, args, ctx) =>
      ctx.repositories.QuestionConfirmation.create(args.input),
    updateQuestionConfirmation: (
      _,
      { input: { positive, negative, id, title } },
      ctx
    ) =>
      ctx.repositories.QuestionConfirmation.update({
        id,
        title,
        positiveLabel: positive.label,
        positiveDescription: positive.description,
        negativeLabel: negative.label,
        negativeDescription: negative.description,
      }),
    deleteQuestionConfirmation: (_, { input }, ctx) =>
      ctx.repositories.QuestionConfirmation.delete(ctx)(input),
    undeleteQuestionConfirmation: (_, { input }, ctx) =>
      ctx.repositories.QuestionConfirmation.restore(input.id),
  },

  Questionnaire: {
    sections: questionnaire => questionnaire.sections,
    createdBy: questionnaire => ({
      id: questionnaire.createdBy, // Temporary until next PR introduces users table.
      name: questionnaire.createdBy,
    }),
    questionnaireInfo: questionnaire => questionnaire,
    metadata: questionnaire => questionnaire.metadata,
  },

  QuestionnaireInfo: {
    totalSectionCount: questionnaire => questionnaire.sections.length,
  },

  Section: {
    pages: section => section.pages,
    questionnaire: (section, args, ctx) => ctx.questionnaire,
    displayName: section => getName(section, "Section"),
    title: (page, args) => formatRichText(page.title, args.format),
    position: ({ id }, args, ctx) => {
      return findIndex(ctx.questionnaire.sections, { id });
    },
    availablePipingAnswers: ({ id }, args, ctx) =>
      ctx.repositories.Section.getPipingAnswersForSection(id),
    availablePipingMetadata: ({ id }, args, ctx) =>
      ctx.repositories.Section.getPipingMetadataForSection(id),
  },

  Page: {
    __resolveType: ({ pageType }) => pageType,
    position: ({ id }, args, ctx) => {
      const section = findSectionByPageId(ctx.questionnaire.sections, id);
      return findIndex(section.pages, { id });
    },
  },

  QuestionPage: {
    answers: page => page.answers,
    section: ({ id }, input, ctx) =>
      findSectionByPageId(ctx.questionnaire.sections, id),
    position: ({ id }, args, ctx) => {
      const section = findSectionByPageId(ctx.questionnaire.sections, id);
      return findIndex(section.pages, { id });
    },
    routingRuleSet: ({ id: questionPageId }, args, ctx) =>
      ctx.repositories.Routing.findRoutingRuleSetByQuestionPageId({
        questionPageId,
      }),
    displayName: page => getName(page, "QuestionPage"),
    title: (page, args) => formatRichText(page.title, args.format),
    confirmation: page => page.confirmation,
    availablePipingAnswers: ({ id }, args, ctx) =>
      ctx.repositories.QuestionPage.getPipingAnswersForQuestionPage(id),
    availablePipingMetadata: ({ id }, args, ctx) =>
      ctx.repositories.QuestionPage.getPipingMetadataForQuestionPage(id),
    availableRoutingQuestions: ({ id }, args, ctx) =>
      ctx.repositories.QuestionPage.getRoutingQuestionsForQuestionPage(id),
    availableRoutingAnswers: ({ id }, args, ctx) =>
      ctx.repositories.QuestionPage.getRoutingAnswers(id),
    availableRoutingDestinations: ({ id }, args, ctx) =>
      ctx.repositories.Routing.getRoutingDestinations(id),
    routing: ({ id }, args, ctx) => ctx.repositories.Routing2.getByPageId(id),
  },

  RoutingRuleSet: {
    routingRules: ({ id }, args, ctx) => {
      return ctx.repositories.Routing.findAllRoutingRules({
        routingRuleSetId: id,
      });
    },
    questionPage: ({ questionPageId }, args, ctx) => {
      return ctx.repositories.Page.getById(questionPageId);
    },
    else: ({ routingDestinationId }, args, ctx) =>
      ctx.repositories.Routing.getRoutingDestination(routingDestinationId),
  },

  RoutingRule: {
    conditions: ({ id }, args, ctx) => {
      return ctx.repositories.Routing.findAllRoutingConditions({
        routingRuleId: id,
      });
    },
    goto: (routingRule, args, ctx) =>
      ctx.repositories.Routing.getRoutingDestination(
        routingRule.routingDestinationId
      ),
  },

  RoutingCondition: {
    routingValue: ({ id, answerId }) => {
      return { conditionId: id, answerId };
    },
    questionPage: ({ questionPageId }, args, ctx) => {
      return isNil(questionPageId)
        ? null
        : ctx.repositories.Page.getById(questionPageId);
    },
    answer: ({ answerId }, args, ctx) => {
      return isNil(answerId) ? null : ctx.repositories.Answer.getById(answerId);
    },
  },

  RoutingConditionValue: {
    __resolveType: async ({ conditionId }, ctx) => {
      const answerType = await ctx.repositories.Routing.getAnswerTypeByConditionId(
        conditionId,
        ctx
      );
      if (includes(["Currency", "Number"], answerType)) {
        return "NumberValue";
      } else {
        return "IDArrayValue";
      }
    },
  },

  IDArrayValue: {
    value: async ({ conditionId }, args, ctx) => {
      const conditionValues = await ctx.repositories.Routing.findAllRoutingConditionValues(
        {
          conditionId,
        }
      );
      return conditionValues.map(conditionValue => conditionValue.optionId);
    },
  },

  NumberValue: {
    id: async ({ conditionId }, args, ctx) => {
      const conditionValues = await ctx.repositories.Routing.findAllRoutingConditionValues(
        { conditionId }
      );
      return conditionValues[0].id;
    },
    numberValue: async ({ conditionId }, args, ctx) => {
      const conditionValues = await ctx.repositories.Routing.findAllRoutingConditionValues(
        { conditionId }
      );
      return conditionValues[0].customNumber;
    },
  },

  RoutingDestination: {
    __resolveType: ({ logicalDestination }) => {
      return isNil(logicalDestination)
        ? "AbsoluteDestination"
        : "LogicalDestination";
    },
  },

  AbsoluteDestinations: {
    __resolveType: ({ pageType }) => {
      if (pageType) {
        return "QuestionPage";
      } else {
        return "Section";
      }
    },
  },

  LogicalDestination: {
    id: destination => destination.logicalDestination,
  },

  Answer: {
    __resolveType: ({ type }) => {
      if (includes(["Checkbox", "Radio"], type)) {
        return "MultipleChoiceAnswer";
      } else if (includes(["DateRange"], type)) {
        return "CompositeAnswer";
      } else {
        return "BasicAnswer";
      }
    },
  },

  BasicAnswer: {
    page: (answer, args, ctx) =>
      ctx.repositories.QuestionPage.getById(answer.questionPageId),
    validation: answer =>
      ["number", "date"].includes(getValidationEntity(answer.type))
        ? answer
        : null,
    displayName: answer => getName(answer, "BasicAnswer"),
  },

  CompositeAnswer: {
    childAnswers: (answer, args, ctx) =>
      ctx.repositories.Answer.splitComposites(answer),
    page: (answer, args, ctx) =>
      ctx.repositories.QuestionPage.getById(answer.questionPageId),
    validation: answer =>
      ["dateRange"].includes(getValidationEntity(answer.type)) ? answer : null,
    displayName: answer => getName(answer, "CompositeAnswer"),
  },

  MultipleChoiceAnswer: {
    page: (answer, args, ctx) =>
      ctx.repositories.QuestionPage.getById(answer.questionPageId),
    options: answer => answer.options,
    // mutuallyExclusiveOption: (answer, args, ctx) =>
    //   ctx.repositories.Option.findExclusiveOptionByAnswerId(answer.id),
    displayName: answer => getName(answer, "MultipleChoiceAnswer"),
  },

  Option: {
    answer: ({ answerId }, args, ctx) =>
      ctx.repositories.Answer.getById(answerId),
    displayName: option => getName(option, "Option"),
    additionalAnswer: ({ additionalAnswerId }, args, ctx) =>
      additionalAnswerId
        ? ctx.repositories.Answer.getById(additionalAnswerId)
        : null,
  },

  ValidationType: {
    __resolveType: answer => {
      const validationEntity = getValidationEntity(answer.type);

      switch (validationEntity) {
        case "number":
          return "NumberValidation";
        case "date":
          return "DateValidation";
        case "dateRange":
          return "DateRangeValidation";

        default:
          throw new TypeError(
            `Validation is not supported on '${answer.type}' answers`
          );
      }
    },
  },

  ValidationRule: {
    __resolveType: ({ validationType }) => {
      switch (validationType) {
        case "maxValue":
          return "MaxValueValidationRule";
        case "minValue":
          return "MinValueValidationRule";
        case "earliestDate":
          return "EarliestDateValidationRule";
        case "latestDate":
          return "LatestDateValidationRule";
        case "minDuration":
          return "MinDurationValidationRule";
        case "maxDuration":
          return "MaxDurationValidationRule";
        default:
          throw new TypeError(
            `Validation is not supported on '${validationType}' answers`
          );
      }
    },
  },

  NumberValidation: {
    minValue: answer => answer.validation.minValue,
    maxValue: answer => answer.validation.maxValue,
  },

  DateValidation: {
    earliestDate: answer => answer.validation.earliestDate,
    latestDate: answer => answer.validation.latestDate,
  },

  DateRangeValidation: {
    earliestDate: answer => answer.validation.earliestDate,
    latestDate: answer => answer.validation.latestDate,
    minDuration: answer => answer.validation.minDuration,
    maxDuration: answer => answer.validation.maxDuration,
  },

  MinValueValidationRule: {
    enabled: ({ enabled }) => enabled,
    inclusive: ({ config }) => config.inclusive,
    custom: ({ custom }) => custom,
  },

  MaxValueValidationRule: {
    enabled: ({ enabled }) => enabled,
    inclusive: ({ config }) => config.inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswerId }, args, ctx) =>
      isNil(previousAnswerId)
        ? null
        : ctx.repositories.Answer.getById(previousAnswerId),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      ctx.repositories.Validation.getPreviousAnswersForValidation(id),
  },

  EarliestDateValidationRule: {
    custom: ({ custom }) => (custom ? new Date(custom) : null),
    offset: ({ config: { offset } }) => offset,
    relativePosition: ({ config: { relativePosition } }) => relativePosition,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswerId }, args, ctx) =>
      isNil(previousAnswerId)
        ? null
        : ctx.repositories.Answer.getById(previousAnswerId),
    metadata: ({ metadataId }, args, ctx) =>
      isNil(metadataId) ? null : ctx.repositories.Metadata.getById(metadataId),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      ctx.repositories.Validation.getPreviousAnswersForValidation(id),
    availableMetadata: ({ id }, args, ctx) =>
      ctx.repositories.Validation.getMetadataForValidation(id),
  },

  LatestDateValidationRule: {
    custom: ({ custom }) => (custom ? new Date(custom) : null),
    offset: ({ config: { offset } }) => offset,
    relativePosition: ({ config: { relativePosition } }) => relativePosition,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswerId }, args, ctx) =>
      isNil(previousAnswerId)
        ? null
        : ctx.repositories.Answer.getById(previousAnswerId),
    metadata: ({ metadataId }, args, ctx) =>
      isNil(metadataId) ? null : ctx.repositories.Metadata.getById(metadataId),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      ctx.repositories.Validation.getPreviousAnswersForValidation(id),
    availableMetadata: ({ id }, args, ctx) =>
      ctx.repositories.Validation.getMetadataForValidation(id),
  },

  MinDurationValidationRule: {
    duration: ({ config: { duration } }) => duration,
  },

  MaxDurationValidationRule: {
    duration: ({ config: { duration } }) => duration,
  },

  Metadata: {
    textValue: ({ type, value }) => (type === "Text" ? value : null),
    languageValue: ({ type, value }) => (type === "Language" ? value : null),
    regionValue: ({ type, value }) => (type === "Region" ? value : null),
    dateValue: ({ type, value }) => {
      if (type !== "Date" || !value) {
        return null;
      }
      return new Date(value);
    },
    displayName: metadata => getName(metadata, "Metadata"),
  },

  QuestionConfirmation: {
    displayName: confirmation => getName(confirmation, "QuestionConfirmation"),
    page: ({ pageId }, args, ctx) => ctx.repositories.Page.getById(pageId),
    positive: ({ positiveLabel, positiveDescription }) => ({
      label: positiveLabel,
      description: positiveDescription,
    }),
    negative: ({ negativeLabel, negativeDescription }) => ({
      label: negativeLabel,
      description: negativeDescription,
    }),
    availablePipingAnswers: ({ id }, args, ctx) =>
      ctx.repositories.QuestionConfirmation.getPipingAnswers(id),
    availablePipingMetadata: ({ id }, args, ctx) =>
      ctx.repositories.QuestionConfirmation.getPipingMetadata(id),
  },

  Date: GraphQLDate,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
