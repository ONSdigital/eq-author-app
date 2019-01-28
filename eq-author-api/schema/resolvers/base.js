const { GraphQLDate } = require("graphql-iso-date");
const { includes, isNil, pick } = require("lodash");
const GraphQLJSON = require("graphql-type-json");
const { getName } = require("../../utils/getName");
const formatRichText = require("../../utils/formatRichText");
const {
  getValidationEntity,
} = require("../../repositories/strategies/validationStrategy");
const { find, flatMap } = require("lodash/fp");

const getSections = ctx => ctx.questionnaire.sections;
const getPages = ctx => flatMap(section => section.pages, getSections(ctx));
const getAnswers = ctx => flatMap(page => page.answers, getPages(ctx));

const Resolvers = {
  Query: {
    questionnaires: (_, args, ctx) => ctx.repositories.Questionnaire.findAll(),
    questionnaire: (root, _, ctx) => ctx.questionnaire,
    section: (parent, { id }, ctx) =>
      find({ id: id.toString() }, getSections(ctx)),
    page: (parent, { id }, ctx) => find({ id: id.toString() }, getPages(ctx)),
    questionPage: (_, { id }, ctx) =>
      find({ id: id.toString() }, getPages(ctx)),
    answer: (root, { id }, ctx) => find({ id: id.toString() }, getAnswers(ctx)),
    answers: async (root, { ids }, ctx) =>
      ctx.repositories.Answer.getAnswers(ids),
    option: (root, { id }, ctx) => ctx.repositories.Option.getById(id),
    //@deprecated - This will be removed once removed from schema
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
      const questionnaire = await ctx.repositories.Questionnaire.insert({
        ...args.input,
        createdBy: ctx.auth.name,
      });
      const section = {
        title: "",
        questionnaireId: questionnaire.id,
      };

      await Resolvers.Mutation.createSection(root, { input: section }, ctx);
      return questionnaire;
    },
    updateQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.update(args.input),
    deleteQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.remove(args.input.id),
    undeleteQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.undelete(args.input.id),
    duplicateQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.duplicate(args.input.id, ctx.auth.name),

    createSection: async (root, args, ctx) => {
      const section = await ctx.repositories.Section.insert(args.input);
      const page = {
        pageType: "QuestionPage",
        title: "",
        description: "",
        sectionId: section.id,
      };

      await Resolvers.Mutation.createPage(root, { input: page }, ctx);
      return section;
    },
    updateSection: (_, { input }, ctx) =>
      ctx.repositories.Section.update(input),
    deleteSection: (_, args, ctx) =>
      ctx.repositories.Section.remove(args.input.id),
    undeleteSection: (_, args, ctx) =>
      ctx.repositories.Section.undelete(args.input.id),
    moveSection: (_, args, ctx) => ctx.repositories.Section.move(args.input),
    duplicateSection: (_, args, ctx) =>
      ctx.repositories.Section.duplicateSection(
        args.input.id,
        args.input.position
      ),

    createPage: (root, args, ctx) => ctx.repositories.Page.insert(args.input),

    updatePage: (_, args, ctx) => ctx.repositories.Page.update(args.input),
    deletePage: (_, args, ctx) => ctx.repositories.Page.remove(args.input.id),
    undeletePage: (_, args, ctx) =>
      ctx.repositories.Page.undelete(args.input.id),
    movePage: (_, args, ctx) => ctx.repositories.Page.move(args.input),
    duplicatePage: (_, args, ctx) =>
      ctx.repositories.Page.duplicatePage(args.input.id, args.input.position),

    createQuestionPage: (root, args, ctx) =>
      ctx.repositories.Page.insert(
        Object.assign({}, args.input, { pageType: "QuestionPage" })
      ),
    updateQuestionPage: (_, args, ctx) =>
      ctx.repositories.QuestionPage.update(args.input),
    deleteQuestionPage: (_, args, ctx) =>
      ctx.repositories.QuestionPage.remove(args.input.id),
    undeleteQuestionPage: (_, args, ctx) =>
      ctx.repositories.QuestionPage.undelete(args.input.id),

    createAnswer: async (root, args, ctx) => {
      const answer = await ctx.repositories.Answer.createAnswer(args.input);
      await ctx.modifiers.BinaryExpression.onAnswerCreated(answer);
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
      ctx.repositories.QuestionConfirmation.delete(input),
    undeleteQuestionConfirmation: (_, { input }, ctx) =>
      ctx.repositories.QuestionConfirmation.restore(input.id),
  },

  Questionnaire: {
    sections: (questionnaire, args, ctx) => questionnaire.sections,
    createdBy: questionnaire => ({
      id: questionnaire.createdBy, // Temporary until next PR introduces users table.
      name: questionnaire.createdBy,
    }),
    questionnaireInfo: questionnaire => questionnaire,
    metadata: (questionnaire, args, ctx) => questionnaire.metadata,
  },

  QuestionnaireInfo: {
    totalSectionCount: (questionnaire, args, ctx) =>
      questionnaire.sections.length,
  },

  Section: {
    pages: section => section.pages,
    questionnaire: (section, args, ctx) => ctx.questionnaire,
    displayName: section => getName(section, "Section"),
    title: (page, args) => formatRichText(page.title, args.format),
    position: () => 1,
    availablePipingAnswers: ({ id }, args, ctx) =>
      ctx.repositories.Section.getPipingAnswersForSection(id),
    availablePipingMetadata: ({ id }, args, ctx) =>
      ctx.repositories.Section.getPipingMetadataForSection(id),
  },
  Page: {
    __resolveType: ({ pageType }) => pageType,
    position: () => 1,
    // position: ({ position, id }, args, ctx) => {
    //   if (position !== undefined) {
    //     return position;
    //   }
    //
    //   return ctx.repositories.Page.getPosition({ id });
    // }
  },

  QuestionPage: {
    answers: ({ id }, args, ctx) =>
      ctx.repositories.Answer.findAll({ questionPageId: id }),
    section: ({ sectionId }, args, ctx) =>
      find({ id: sectionId }, ctx.questionnaire.sections),
    position: (page, args, ctx) => Resolvers.Page.position(page, args, ctx),
    routingRuleSet: ({ id: questionPageId }, args, ctx) =>
      ctx.repositories.Routing.findRoutingRuleSetByQuestionPageId({
        questionPageId,
      }),
    displayName: page => getName(page, "QuestionPage"),
    title: (page, args) => formatRichText(page.title, args.format),
    confirmation: async (page, args, ctx) =>
      ctx.repositories.QuestionConfirmation.findByPageId(page.id),
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
    options: (answer, args, ctx) =>
      ctx.repositories.Option.findAll({
        answerId: answer.id,
        mutuallyExclusive: false,
      }),
    mutuallyExclusiveOption: (answer, args, ctx) =>
      ctx.repositories.Option.findExclusiveOptionByAnswerId(answer.id),
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
    minValue: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "minValue"
      ),
    maxValue: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "maxValue"
      ),
  },

  DateValidation: {
    earliestDate: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "earliestDate"
      ),
    latestDate: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "latestDate"
      ),
  },

  DateRangeValidation: {
    earliestDate: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "earliestDate"
      ),
    latestDate: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "latestDate"
      ),
    minDuration: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "minDuration"
      ),
    maxDuration: (answer, args, ctx) =>
      ctx.repositories.Validation.findByAnswerIdAndValidationType(
        answer,
        "maxDuration"
      ),
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
