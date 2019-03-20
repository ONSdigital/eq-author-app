const { GraphQLDate } = require("graphql-iso-date");
const {
  compact,
  includes,
  isNil,
  pick,
  find,
  filter,
  findIndex,
  map,
  merge,
  remove,
  flatMap,
  omit,
  set,
  slice,
  cloneDeep,
  first,
  some,
  concat,
  takeRightWhile,
  kebabCase,
} = require("lodash");
const GraphQLJSON = require("graphql-type-json");
const { getName } = require("../../utils/getName");
const {
  getValidationEntity,
} = require("../../src/businessLogic/createValidation");
const uuid = require("uuid");
const deepMap = require("deep-map");
const { currentVersion } = require("../../migrations");

const createAnswer = require("../../src/businessLogic/createAnswer");
const onAnswerCreated = require("../../src/businessLogic/onAnswerCreated");
const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");
const updateMetadata = require("../../src/businessLogic/updateMetadata");
const getPreviousAnswersForPage = require("../../src/businessLogic/getPreviousAnswersForPage");
const getPreviousAnswersForSection = require("../../src/businessLogic/getPreviousAnswersForSection");
const createOption = require("../../src/businessLogic/createOption");
const addPrefix = require("../../utils/addPrefix");
const { DATE, DATE_RANGE } = require("../../constants/answerTypes");
const { DATE: METADATA_DATE } = require("../../constants/metadataTypes");
const { ROUTING_ANSWER_TYPES } = require("../../constants/routingAnswerTypes");
const {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  listQuestionnaires,
} = require("../../utils/datastore");

const { VALIDATION_TYPES } = require("../../constants/validationTypes");

const getSection = ctx => input => {
  return find(ctx.questionnaire.sections, { id: input.sectionId });
};

const getPage = ctx => input => {
  const pages = flatMap(ctx.questionnaire.sections, section => section.pages);
  return find(pages, { id: input.pageId });
};

const getAnswers = ctx => {
  return flatMap(ctx.questionnaire.sections, section =>
    flatMap(section.pages, page => page.answers)
  );
};

const getAnswer = ctx => input => {
  const answers = getAnswers(ctx);
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

const getValidation = ctx => id => {
  const answers = getAnswers(ctx);
  const answerValidations = map(answers, answer => ({
    answerId: answer.id,
    ...answer.validation,
  }));
  const validations = flatMap(answerValidations, validation => {
    return VALIDATION_TYPES.map(type => {
      if (validation[type]) {
        validation[type].answerId = validation.answerId;
      }
      return merge(validation[type], { validationType: type });
    });
  });

  return find(validations, { id: id });
};

const getAvailableMetadataForValidation = ctx => id => {
  const validation = getValidation(ctx)(id);
  const answer = getAnswer(ctx)({ answerId: validation.answerId });
  if (answer.type === DATE || answer.type === DATE_RANGE) {
    return filter(ctx.questionnaire.metadata, { type: METADATA_DATE });
  } else {
    return []; //Currently do not support validation against any other types
  }
};

const getAvailablePreviousAnswersForValidation = ctx => id => {
  const validation = getValidation(ctx)(id);
  const answer = getAnswer(ctx)({ answerId: validation.answerId });
  const pages = flatMap(ctx.questionnaire.sections, section => section.pages);
  const currentPageIndex = findIndex(pages, { id: answer.questionPageId });
  const previousPages = slice(pages, 0, currentPageIndex);
  const previousAnswers = flatMap(previousPages, page => page.answers);
  const previousAnswersOfSameType = filter(previousAnswers, {
    type: answer.type,
  });
  return previousAnswersOfSameType;
};

const findSectionByPageId = (sections, id) =>
  find(sections, section => {
    if (section.pages && some(section.pages, { id })) {
      return section;
    }
  });

const createPage = (input = {}) => ({
  id: uuid.v4(),
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

const createSection = (input = {}) => ({
  id: uuid.v4(),
  title: "",
  introductionEnabled: false,
  pages: [createPage()],
  alias: "",
  ...input,
});

const createNewQuestionnaire = input => ({
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
  ...input,
});

const remapAllNestedIds = entity => {
  const transformationMatrix = {};
  const remappedIdEntity = deepMap(entity, (value, key) => {
    if (key === "id") {
      const newEntityId = uuid.v4();
      transformationMatrix[value] = newEntityId;
      return newEntityId;
    }
    return value;
  });
  return deepMap(remappedIdEntity, value => {
    if (Object.keys(transformationMatrix).includes(value)) {
      return transformationMatrix[value];
    }
    return value;
  });
};

const getQuestionnaireList = () => {
  return listQuestionnaires();
};

const Resolvers = {
  Query: {
    questionnaires: () => getQuestionnaireList(),
    questionnaire: (root, args, ctx) => ctx.questionnaire,
    section: (root, { input }, ctx) => getSection(ctx)(input),
    page: (root, { input }, ctx) => getPage(ctx)(input),
    questionPage: (root, { input }, ctx) => getPage(ctx)(input),
    answer: (root, { input }, ctx) => getAnswer(ctx)(input),
    answers: async (root, { ids }, ctx) =>
      getAnswers(ctx).filter(({ id }) => ids.includes(id)),
    option: (root, { input }, ctx) => getOption(ctx)(input),
    questionConfirmation: (root, { id }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );

      let confirmationPage;
      let pageId;

      pages.map(page => {
        if (page.confirmation && page.confirmation.id === id) {
          confirmationPage = page.confirmation;
          pageId = page.id;
        }
      });

      if (!confirmationPage) {
        return null;
      }

      return { pageId, ...confirmationPage };
    },
    me: (root, args, ctx) => ({
      id: ctx.auth.sub,
      ...pick(ctx.auth, ["name", "email", "picture"]),
      name: ctx.auth.name || ctx.auth.email,
    }),
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

    movePage: async (_, { input }, ctx) => {
      const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
      const removedPage = first(remove(section.pages, { id: input.id }));
      if (input.sectionId === section.id) {
        section.pages.splice(input.position, 0, removedPage);
      } else {
        const newsection = find(ctx.questionnaire.sections, {
          id: input.sectionId,
        });
        newsection.pages.splice(input.position, 0, removedPage);
      }
      await saveQuestionnaire(ctx.questionnaire);
      return removedPage;
    },

    duplicatePage: async (_, { input }, ctx) => {
      const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
      const page = find(section.pages, { id: input.id });
      const newpage = omit(page, "id");
      set(newpage, "alias", addPrefix(newpage.alias));
      set(newpage, "title", addPrefix(newpage.title));
      const duplicatedPage = createPage(newpage);
      const remappedPage = remapAllNestedIds(duplicatedPage);
      section.pages.splice(input.position, 0, remappedPage);
      await saveQuestionnaire(ctx.questionnaire);
      return remappedPage;
    },

    createQuestionPage: async (
      root,
      { input: { position, ...pageInput } },
      ctx
    ) => {
      const section = find(ctx.questionnaire.sections, {
        id: pageInput.sectionId,
      });
      const page = createPage(pageInput);
      const insertionPosition =
        typeof position === "number" ? position : section.pages.length;
      section.pages.splice(insertionPosition, 0, page);
      await saveQuestionnaire(ctx.questionnaire);
      return page;
    },
    updateQuestionPage: async (_, { input }, ctx) => {
      const page = getPage(ctx)({ pageId: input.id });
      merge(page, input);
      await saveQuestionnaire(ctx.questionnaire);
      return page;
    },
    deleteQuestionPage: async (_, { input }, ctx) => {
      const section = findSectionByPageId(ctx.questionnaire.sections, input.id);
      remove(section.pages, { id: input.id });
      await saveQuestionnaire(ctx.questionnaire);
      return section;
    },

    createAnswer: async (root, { input }, ctx) => {
      const page = getPage(ctx)({ pageId: input.questionPageId });
      const answer = createAnswer(input);
      page.answers.push(answer);

      onAnswerCreated(ctx.questionnaire, page, answer);

      await saveQuestionnaire(ctx.questionnaire);
      return answer;
    },
    updateAnswer: async (root, { input }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      const answers = compact(
        flatMap(pages, page => (page.answers ? page.answers : null))
      );

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
    deleteAnswer: async (_, { input }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      const page = find(pages, page => {
        if (page.answers && some(page.answers, { id: input.id })) {
          return page;
        }
      });

      const deletedAnswer = first(remove(page.answers, { id: input.id }));

      onAnswerDeleted(ctx.questionnaire, page, deletedAnswer);

      await saveQuestionnaire(ctx.questionnaire);
      return deletedAnswer;
    },
    moveAnswer: async (_, { input: { id, position } }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
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
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      const answers = flatMap(pages, page => page.answers);
      const parent = find(answers, { id: input.answerId });
      const option = createOption(input);

      parent.options.push(option);

      await saveQuestionnaire(ctx.questionnaire);

      return option;
    },

    createMutuallyExclusiveOption: async (root, { input }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
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
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      const answers = compact(flatMap(pages, page => page.answers));
      const options = flatMap(answers, answer => answer.options);
      const option = find(options, { id: input.id });

      merge(option, input);

      await saveQuestionnaire(ctx.questionnaire);

      return option;
    },
    deleteOption: async (_, { input }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
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
      const validation = getValidation(ctx)(args.input.id);
      validation.enabled = args.input.enabled;

      const newValidation = Object.assign({}, validation);
      delete validation.validationType;

      await saveQuestionnaire(ctx.questionnaire);

      return newValidation;
    },
    updateValidationRule: async (_, args, ctx) => {
      const validation = getValidation(ctx)(args.input.id);
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
        value: null,
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
      const section = findSectionByPageId(
        ctx.questionnaire.sections,
        input.pageId
      );
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

      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );

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
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );

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
    displayName: page => getName(page, "QuestionPage"),
    confirmation: page => page.confirmation,
    availablePipingAnswers: ({ id }, args, ctx) =>
      getPreviousAnswersForPage(ctx.questionnaire, id),
    availablePipingMetadata: (page, args, ctx) => ctx.questionnaire.metadata,
    availableRoutingAnswers: ({ id }, args, ctx) =>
      getPreviousAnswersForPage(
        ctx.questionnaire,
        id,
        true,
        ROUTING_ANSWER_TYPES
      ),
    availableRoutingDestinations: ({ id }, args, ctx) => {
      const section = find(ctx.questionnaire.sections, section => {
        if (section.pages && some(section.pages, { id })) {
          return section;
        }
      });

      const questionPages = takeRightWhile(
        section.pages,
        page => page.id !== id
      );
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
        questionPages,
      };
    },
    routing: questionPage => questionPage.routing,
  },

  LogicalDestination: {
    id: destination => destination.logicalDestination,
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
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );

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
  },

  MultipleChoiceAnswer: {
    page: (answer, args, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      return find(pages, page => {
        if (page.answers && some(page.answers, { id: answer.id })) {
          return page;
        }
      });
    },
    options: answer => answer.options,
    mutuallyExclusiveOption: answer =>
      find(answer.options, { mutuallyExclusive: true }),
    displayName: answer => getName(answer, "MultipleChoiceAnswer"),
  },

  Option: {
    answer: (option, args, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
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
    inclusive: ({ inclusive }) => inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer)
        ? null
        : getAnswer(ctx)({ answerId: previousAnswer }),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx)(id),
  },

  MaxValueValidationRule: {
    enabled: ({ enabled }) => enabled,
    inclusive: ({ inclusive }) => inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer)
        ? null
        : getAnswer(ctx)({ answerId: previousAnswer }),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx)(id),
  },

  EarliestDateValidationRule: {
    custom: ({ custom }) => (custom ? new Date(custom) : null),
    offset: ({ offset }) => offset,
    relativePosition: ({ relativePosition }) => relativePosition,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer)
        ? null
        : getAnswer(ctx)({ answerId: previousAnswer }),
    metadata: ({ metadata }, args, ctx) =>
      isNil(metadata)
        ? null
        : find(ctx.questionnaire.metadata, { id: metadata }),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx)(id),
    availableMetadata: ({ id }, args, ctx) =>
      getAvailableMetadataForValidation(ctx)(id),
  },

  LatestDateValidationRule: {
    custom: ({ custom }) => (custom ? new Date(custom) : null),
    offset: ({ offset }) => offset,
    relativePosition: ({ relativePosition }) => relativePosition,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer)
        ? null
        : getAnswer(ctx)({ answerId: previousAnswer }),
    metadata: ({ metadata }, args, ctx) =>
      isNil(metadata)
        ? null
        : find(ctx.questionnaire.metadata, { id: metadata }),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      getAvailablePreviousAnswersForValidation(ctx)(id),
    availableMetadata: ({ id }, args, ctx) =>
      getAvailableMetadataForValidation(ctx)(id),
  },

  MinDurationValidationRule: {
    duration: ({ duration }) => duration,
  },

  MaxDurationValidationRule: {
    duration: ({ duration }) => duration,
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
    page: ({ pageId }, args, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );

      return find(pages, { id: pageId });
    },
    availablePipingAnswers: ({ id }, args, ctx) =>
      getPreviousAnswersForPage(ctx.questionnaire, id),
    availablePipingMetadata: (page, args, ctx) => ctx.questionnaire.metadata,
  },

  Date: GraphQLDate,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
