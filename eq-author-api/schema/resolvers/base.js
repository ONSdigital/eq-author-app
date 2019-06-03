const { GraphQLDate } = require("graphql-iso-date");
const {
  compact,
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
  first,
  some,
  concat,
  kebabCase,
} = require("lodash");
const GraphQLJSON = require("graphql-type-json");
const { PubSub } = require("apollo-server");

const { getName } = require("../../utils/getName");
const {
  getValidationEntity,
} = require("../../src/businessLogic/createValidation");
const uuid = require("uuid");
const { currentVersion } = require("../../migrations");

const {
  getSectionById,
  getSectionByPageId,
  getPages,
  getPageById,
  getPageByConfirmationId,
  getPageByValidationId,
  getAnswers,
  getAnswerById,
  getOptionById,
  getConfirmationById,
  getValidationById,
  getAvailablePreviousAnswersForValidation,
  getAvailableMetadataForValidation,
  remapAllNestedIds,
} = require("./utils");

const createAnswer = require("../../src/businessLogic/createAnswer");
const onAnswerCreated = require("../../src/businessLogic/onAnswerCreated");
const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");
const updateMetadata = require("../../src/businessLogic/updateMetadata");
const getPreviousAnswersForPage = require("../../src/businessLogic/getPreviousAnswersForPage");
const getPreviousAnswersForSection = require("../../src/businessLogic/getPreviousAnswersForSection");
const createOption = require("../../src/businessLogic/createOption");
const addPrefix = require("../../utils/addPrefix");
const { createQuestionPage } = require("./pages/questionPage");

const { BUSINESS } = require("../../constants/questionnaireTypes");
const {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
} = require("../../utils/datastore");

const {
  createDefaultBusinessSurveyMetadata,
} = require("../../utils/defaultMetadata");

const { listQuestionnaires } = require("../../utils/datastore");

const {
  createQuestionnaireIntroduction,
} = require("./questionnaireIntroduction");

let errorCount = 0;

const getQuestionnaireList = () => {
  console.log("PUBLISHING");
  global.pubsub.publish("THING", {
    validationUpdated: { id: "1", errorCount },
  });
  errorCount++;
  return listQuestionnaires();
};

const createSection = (input = {}) => ({
  id: uuid.v4(),
  title: "",
  introductionEnabled: false,
  pages: [createQuestionPage()],
  alias: "",
  ...input,
});

const createNewQuestionnaire = input => {
  const defaultQuestionnaire = {
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
    summary: false,
    version: currentVersion,
    shortTitle: "",
    introduction: null,
  };

  let changes = {};
  if (input.type === BUSINESS) {
    const metadata = createDefaultBusinessSurveyMetadata();
    changes = {
      metadata,
      introduction: createQuestionnaireIntroduction(metadata),
    };
  }

  return {
    ...defaultQuestionnaire,
    ...changes,
    ...input,
  };
};

global.pubsub = new PubSub();

const Resolvers = {
  Query: {
    questionnaires: () => getQuestionnaireList(),
    questionnaire: (root, args, ctx) => ctx.questionnaire,
    section: (root, { input }, ctx) => getSectionById(ctx, input.sectionId),
    page: (root, { input }, ctx) => getPageById(ctx, input.pageId),
    answer: (root, { input }, ctx) => getAnswerById(ctx, input.answerId),
    answers: async (root, { ids }, ctx) =>
      getAnswers(ctx).filter(({ id }) => ids.includes(id)),
    option: (root, { input }, ctx) => getOptionById(ctx, input.optionId),
    questionConfirmation: (root, { id }, ctx) => {
      const confirmationPage = getConfirmationById(ctx, id);
      if (!confirmationPage) {
        return null;
      }

      const page = getPageByConfirmationId(ctx, id);

      return { pageId: page.id, ...confirmationPage };
    },
    me: (root, args, ctx) => ({
      id: ctx.auth.sub,
      ...pick(ctx.auth, ["name", "email", "picture"]),
      name: ctx.auth.name || ctx.auth.email,
    }),
  },

  Subscription: {
    validationUpdated: {
      subscribe: (...args) => {
        // eslint-disable-next-line
        console.log(...args);
        return global.pubsub.asyncIterator(["THING"]);
      },
    },
  },

  Mutation: {
    createQuestionnaire: async (root, args, ctx) => {
      const questionnaire = createNewQuestionnaire({
        ...args.input,
        createdBy: ctx.auth.name || ctx.auth.email,
      });
      // Saving to ctx so it can be used by all other resolvers and read by tests
      ctx.questionnaire = await createQuestionnaire(questionnaire);
      return ctx.questionnaire;
    },
    updateQuestionnaire: async (_, { input }, ctx) => {
      ctx.questionnaire = merge(ctx.questionnaire, input);
      await saveQuestionnaire(ctx.questionnaire);
      return ctx.questionnaire;
    },
    deleteQuestionnaire: async (_, { input }) => {
      await deleteQuestionnaire(input.id);
      return { id: input.id };
    },

    duplicateQuestionnaire: async (_, { input }) => {
      const questionnaire = await getQuestionnaire(input.id);
      const newQuestionnaire = {
        ...questionnaire,
        title: addPrefix(questionnaire.title),
        shortTitle: addPrefix(questionnaire.shortTitle),
        id: uuid.v4(),
      };

      return createQuestionnaire(newQuestionnaire);
    },
    createSection: async (root, { input }, ctx) => {
      const section = createSection(input);
      ctx.questionnaire.sections.push(section);
      await saveQuestionnaire(ctx.questionnaire);
      return section;
    },
    updateSection: async (_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      merge(section, input);
      await saveQuestionnaire(ctx.questionnaire);
      return section;
    },
    deleteSection: async (root, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      remove(ctx.questionnaire.sections, section);
      await saveQuestionnaire(ctx.questionnaire);
      return section;
    },
    moveSection: async (_, { input }, ctx) => {
      const removedSection = first(
        remove(ctx.questionnaire.sections, { id: input.id })
      );
      ctx.questionnaire.sections.splice(input.position, 0, removedSection);
      await saveQuestionnaire(ctx.questionnaire);
      return removedSection;
    },
    duplicateSection: async (_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      const newSection = omit(cloneDeep(section), "id");
      set(newSection, "alias", addPrefix(newSection.alias));
      set(newSection, "title", addPrefix(newSection.title));
      const duplicatedSection = createSection(newSection);
      const remappedSection = remapAllNestedIds(duplicatedSection);
      ctx.questionnaire.sections.splice(input.position, 0, remappedSection);
      await saveQuestionnaire(ctx.questionnaire);
      return remappedSection;
    },
    createAnswer: async (root, { input }, ctx) => {
      const page = getPageById(ctx, input.questionPageId);
      const answer = createAnswer(input);
      page.answers.push(answer);

      onAnswerCreated(page, answer);

      await saveQuestionnaire(ctx.questionnaire);
      return answer;
    },
    updateAnswer: async (root, { input }, ctx) => {
      const answers = getAnswers(ctx);

      const additionalAnswers = flatMap(answers, answer =>
        answer.options
          ? flatMap(answer.options, option => option.additionalAnswer)
          : null
      );

      const answer = find(concat(answers, additionalAnswers), { id: input.id });
      merge(answer, input);
      await saveQuestionnaire(ctx.questionnaire);

      return answer;
    },
    updateAnswersOfType: async (
      root,
      { input: { questionPageId, type, properties } },
      ctx
    ) => {
      const page = getPageById(ctx, questionPageId);
      const answersOfType = page.answers.filter(a => a.type === type);
      answersOfType.forEach(answer => {
        answer.properties = {
          ...answer.properties,
          ...properties,
        };
      });

      await saveQuestionnaire(ctx.questionnaire);

      return answersOfType;
    },
    deleteAnswer: async (_, { input }, ctx) => {
      const pages = getPages(ctx);
      const page = find(pages, page => {
        if (page.answers && some(page.answers, { id: input.id })) {
          return page;
        }
      });

      const deletedAnswer = first(remove(page.answers, { id: input.id }));

      onAnswerDeleted(page, deletedAnswer);

      await saveQuestionnaire(ctx.questionnaire);
      return page;
    },
    moveAnswer: async (_, { input: { id, position } }, ctx) => {
      const pages = getPages(ctx);
      const page = find(pages, page => {
        if (page.answers && some(page.answers, { id })) {
          return page;
        }
      });

      const answerMoving = first(remove(page.answers, { id }));
      page.answers.splice(position, 0, answerMoving);

      await saveQuestionnaire(ctx.questionnaire);

      return answerMoving;
    },

    createOption: async (root, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = flatMap(pages, page => page.answers);
      const parent = find(answers, { id: input.answerId });
      const option = createOption(input);

      parent.options.push(option);

      await saveQuestionnaire(ctx.questionnaire);

      return option;
    },

    createMutuallyExclusiveOption: async (root, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = flatMap(pages, page => page.answers);
      const answer = find(answers, { id: input.answerId });

      const existing = find(answer.options, { mutuallyExclusive: true });
      if (!isNil(existing)) {
        throw new Error(
          "There is already an exclusive checkbox on this answer."
        );
      }

      const option = createOption({ mutuallyExclusive: true, ...input });

      answer.options.push(option);

      await saveQuestionnaire(ctx.questionnaire);

      return option;
    },
    updateOption: async (_, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = compact(flatMap(pages, page => page.answers));
      const options = flatMap(answers, answer => answer.options);
      const option = find(options, { id: input.id });

      merge(option, input);

      await saveQuestionnaire(ctx.questionnaire);

      return option;
    },
    deleteOption: async (_, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = flatMap(pages, page => page.answers);

      const answer = find(answers, answer => {
        if (answer.options && some(answer.options, { id: input.id })) {
          return answer;
        }
      });

      const removedOption = first(remove(answer.options, { id: input.id }));

      pages.forEach(page => {
        if (!page.routing) {
          return;
        }

        page.routing.rules.forEach(rule => {
          rule.expressionGroup.expressions.forEach(expression => {
            if (expression.right && expression.right.optionIds) {
              remove(
                expression.right.optionIds,
                value => value === removedOption.id
              );
            }
          });
        });
      });

      await saveQuestionnaire(ctx.questionnaire);

      return removedOption;
    },
    toggleValidationRule: async (_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      validation.enabled = args.input.enabled;

      const newValidation = Object.assign({}, validation);
      delete validation.validationType;

      await saveQuestionnaire(ctx.questionnaire);

      return newValidation;
    },
    updateValidationRule: async (_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      const { validationType } = validation;

      merge(validation, args.input[`${validationType}Input`]);

      const newValidation = Object.assign({}, validation);
      delete validation.validationType;

      await saveQuestionnaire(ctx.questionnaire);

      return newValidation;
    },
    createMetadata: async (root, args, ctx) => {
      const newMetadata = {
        alias: null,
        id: uuid.v4(),
        key: null,
        type: "Text",
      };
      ctx.questionnaire.metadata.push(newMetadata);
      await saveQuestionnaire(ctx.questionnaire);
      return newMetadata;
    },
    updateMetadata: async (_, { input }, ctx) => {
      const original = find(ctx.questionnaire.metadata, { id: input.id });
      const result = updateMetadata(original, input);
      merge(original, result);
      await saveQuestionnaire(ctx.questionnaire);
      return result;
    },
    deleteMetadata: async (_, { input }, ctx) => {
      const deletedMetadata = first(
        remove(ctx.questionnaire.metadata, {
          id: input.id,
        })
      );
      await saveQuestionnaire(ctx.questionnaire);
      return deletedMetadata;
    },
    createQuestionConfirmation: async (_, { input }, ctx) => {
      const section = getSectionByPageId(ctx, input.pageId);
      const page = find(section.pages, { id: input.pageId });
      const questionConfirmation = {
        id: uuid.v4(),
        title: "",
        positive: { label: null, description: null },
        negative: { label: null, description: null },
      };
      set(page, "confirmation", questionConfirmation);
      await saveQuestionnaire(ctx.questionnaire);
      return {
        pageId: input.pageId,
        ...questionConfirmation,
      };
    },
    updateQuestionConfirmation: async (
      _,
      { input: { positive, negative, id, title } },
      ctx
    ) => {
      const newValues = {
        title,
        positive,
        negative,
      };

      const pages = getPages(ctx);

      let confirmationPage;
      let pageId;

      pages.map(page => {
        if (page.confirmation && page.confirmation.id === id) {
          confirmationPage = page.confirmation;
          pageId = page.id;
        }
      });

      merge(confirmationPage, newValues);

      await saveQuestionnaire(ctx.questionnaire);

      return {
        pageId,
        ...confirmationPage,
      };
    },
    deleteQuestionConfirmation: async (_, { input }, ctx) => {
      const pages = getPages(ctx);

      let confirmationPage;
      let pageContainingConfirmation;

      pages.map(page => {
        if (page.confirmation && page.confirmation.id === input.id) {
          confirmationPage = page.confirmation;
          pageContainingConfirmation = page;
        }
      });

      delete pageContainingConfirmation.confirmation;
      await saveQuestionnaire(ctx.questionnaire);

      return {
        pageId: pageContainingConfirmation.id,
        ...confirmationPage,
      };
    },
  },

  Questionnaire: {
    sections: questionnaire => questionnaire.sections,
    createdBy: ({ createdBy }) => {
      return {
        id: kebabCase(createdBy), // Temporary until next PR introduces users table.
        name: createdBy,
      };
    },
    createdAt: questionnaire => new Date(questionnaire.createdAt),
    questionnaireInfo: questionnaire => questionnaire,
    metadata: questionnaire => questionnaire.metadata,
    displayName: questionnaire =>
      questionnaire.shortTitle || questionnaire.title,
  },

  QuestionnaireInfo: {
    totalSectionCount: questionnaire => questionnaire.sections.length,
  },

  Section: {
    pages: section => section.pages,
    questionnaire: (section, args, ctx) => ctx.questionnaire,
    displayName: section => getName(section, "Section"),
    position: ({ id }, args, ctx) => {
      return findIndex(ctx.questionnaire.sections, { id });
    },
    availablePipingAnswers: ({ id }, args, ctx) =>
      getPreviousAnswersForSection(ctx.questionnaire, id),
    availablePipingMetadata: (section, args, ctx) => ctx.questionnaire.metadata,
  },

  LogicalDestination: {
    id: destination => destination.logicalDestination,
  },

  ValidationErrorInfo: {
    errors: errorInfo => errorInfo,
    totalCount: errorInfo => errorInfo.length,
  },

  Answer: {
    __resolveType: ({ type }) => {
      if (includes(["Checkbox", "Radio"], type)) {
        return "MultipleChoiceAnswer";
      } else {
        return "BasicAnswer";
      }
    },
  },

  BasicAnswer: {
    page: ({ id }, args, ctx) => {
      const pages = getPages(ctx);

      const parentPage = find(pages, page =>
        some(page.answers, answer => answer.id === id)
      );

      return parentPage;
    },
    validation: answer =>
      ["number", "date", "dateRange"].includes(getValidationEntity(answer.type))
        ? answer
        : null,
    displayName: answer => getName(answer, "BasicAnswer"),

    // secondaryLabel needed for some answer types e.g. DateRage: label->From field, secodaryLabel->To field.
    // need to define a default for secondaryLabel for use in piping. If label exists then displayName doesn't contain default.
    // If secondaryLabel is set to default, then the default is displayed in answer label instead of leaving it blank
    // Have defined a secondaryLabelDefault field to fallback on if secondaryLabel is empty
    secondaryLabelDefault: answer =>
      getName({ label: answer.secondaryLabel }, "BasicAnswer"),
  },

  MultipleChoiceAnswer: {
    page: (answer, args, ctx) => {
      const pages = getPages(ctx);
      return find(pages, page => {
        if (page.answers && some(page.answers, { id: answer.id })) {
          return page;
        }
      });
    },
    options: answer => answer.options.filter(o => !o.mutuallyExclusive),
    mutuallyExclusiveOption: answer =>
      find(answer.options, { mutuallyExclusive: true }),
    displayName: answer => getName(answer, "MultipleChoiceAnswer"),
  },

  Option: {
    answer: (option, args, ctx) => {
      const pages = getPages(ctx);
      const answers = flatMap(pages, page => page.answers);
      return find(answers, answer => {
        if (answer.options && some(answer.options, { id: option.id })) {
          return answer;
        }
      });
    },
    displayName: option => getName(option, "Option"),
    additionalAnswer: option => option.additionalAnswer,
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
        case "total":
          return "TotalValidationRule";
        default:
          throw new TypeError(
            `ValidationRule of type '${validationType}' is not supported`
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
    inclusive: ({ inclusive }) => inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx, id),
  },

  MaxValueValidationRule: {
    enabled: ({ enabled }) => enabled,
    inclusive: ({ inclusive }) => inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx, id),
  },

  EarliestDateValidationRule: {
    custom: ({ custom }) => (custom ? new Date(custom) : null),
    offset: ({ offset }) => offset,
    relativePosition: ({ relativePosition }) => relativePosition,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
    metadata: ({ metadata }, args, ctx) =>
      isNil(metadata)
        ? null
        : find(ctx.questionnaire.metadata, { id: metadata }),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx, id),
    availableMetadata: ({ id }, args, ctx) =>
      getAvailableMetadataForValidation(ctx, id),
  },

  LatestDateValidationRule: {
    custom: ({ custom }) => (custom ? new Date(custom) : null),
    offset: ({ offset }) => offset,
    relativePosition: ({ relativePosition }) => relativePosition,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
    metadata: ({ metadata }, args, ctx) =>
      isNil(metadata)
        ? null
        : find(ctx.questionnaire.metadata, { id: metadata }),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx, id),
    availableMetadata: ({ id }, args, ctx) =>
      getAvailableMetadataForValidation(ctx, id),
  },

  MinDurationValidationRule: {
    duration: ({ duration }) => duration,
  },

  MaxDurationValidationRule: {
    duration: ({ duration }) => duration,
  },

  TotalValidationRule: {
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
    availablePreviousAnswers: ({ id }, args, ctx) => {
      const page = getPageByValidationId(ctx, id);
      const answerType = page.answers[0].type;
      return getPreviousAnswersForPage(ctx.questionnaire, page.id, false, [
        answerType,
      ]);
    },
  },

  Metadata: {
    dateValue: ({ type, dateValue }) => {
      if (type !== "Date" || !dateValue) {
        return null;
      }
      return new Date(dateValue);
    },
    displayName: metadata => getName(metadata, "Metadata"),
  },

  QuestionConfirmation: {
    displayName: confirmation => getName(confirmation, "QuestionConfirmation"),
    page: ({ pageId }, args, ctx) => getPageById(ctx, pageId),
    availablePipingAnswers: ({ id }, args, ctx) =>
      getPreviousAnswersForPage(ctx.questionnaire, id),
    availablePipingMetadata: (page, args, ctx) => ctx.questionnaire.metadata,
  },

  Date: GraphQLDate,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
