const { GraphQLDate } = require("graphql-iso-date");
const {
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
  get,
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
const updateMetadata = require("../../src/businessLogic/updateMetadata");
const getPreviousAnswersForPage = require("../../src/businessLogic/getPreviousAnswersForPage");
const getPreviousAnswersForSection = require("../../src/businessLogic/getPreviousAnswersForSection");
const createOption = require("../../src/businessLogic/createOption");
const addPrefix = require("../../utils/addPrefix");
const loadQuestionnaire = require("../../utils/loadQuestionnaire");
const getPreviousPagesForPage = require("../../src/businessLogic/getPreviousPagesForPage");
const { DATE, DATE_RANGE } = require("../../constants/answerTypes");
const { DATE: METADATA_DATE } = require("../../constants/metadataTypes");
const { ROUTING_ANSWER_TYPES } = require("../../constants/routingAnswerTypes");
const save = require("../../utils/saveQuestionnaire");

const {
  VALIDATION_TYPES,
  VALIDATION_INPUT_TYPES,
} = require("../../constants/validationTypes");

const getSection = ctx => input => {
  return find(ctx.questionnaire.sections, { id: input.sectionId });
};

const createRoutingRuleSet = require("../../src/businessLogic/createRoutingRuleSet");

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
      return validation[type];
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
  createdAt: "2019-01-01",
  metadata: [],
  sections: [createSection()],
  ...input,
});

const getQuestionnaireList = () =>
  JSON.parse(loadQuestionnaire("QuestionnaireList"));

const getQuestionnaireById = questionnaireID =>
  JSON.parse(loadQuestionnaire(questionnaireID));

const saveQuestionnaireList = data => {
  fs.writeFileSync(
    `data/QuestionnaireList.json`,
    stringify(data, { space: 4 })
  );
  return data;
};

const Resolvers = {
  Query: {
    questionnaires: (root, args, ctx) => getQuestionnaireList(),
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

      return { pageId, ...confirmationPage };
    },
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
      save(questionnaire);
      const questionnaireList = getQuestionnaireList();
      questionnaireList.push({
        ...omit(questionnaire, "sections", "metadata"),
        createdAt: questionnaire.createdAt.toString().split("T")[0],
      });
      saveQuestionnaireList(questionnaireList);

      return questionnaire;
    },
    updateQuestionnaire: (_, { input }, ctx) => {
      return save({
        ...ctx.questionnaire,
        ...input,
      });
    },
    deleteQuestionnaire: (_, { input }, ctx) => {
      const questionnaireList = getQuestionnaireList();
      const deletedQuestionnaire = first(
        remove(questionnaireList, { id: input.id })
      );
      saveQuestionnaireList(questionnaireList);
      return deletedQuestionnaire;
    },
    undeleteQuestionnaire: (_, args, ctx) =>
      ctx.repositories.Questionnaire.undelete(args.input.id),

    duplicateQuestionnaire: (_, { input }, ctx) => {
      const questionnaire = getQuestionnaireById(input.id);
      const newQuestionnaire = omit(cloneDeep(questionnaire), "id");
      set(newQuestionnaire, "title", addPrefix(newQuestionnaire.title));
      set(newQuestionnaire, "id", uuid.v4());

      save(newQuestionnaire);

      const questionnaireList = getQuestionnaireList();
      questionnaireList.push({
        ...omit(newQuestionnaire, "sections", "metadata"),
        createdAt: newQuestionnaire.createdAt.toString().split("T")[0],
      });
      saveQuestionnaireList(questionnaireList);
      return newQuestionnaire;
    },
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
      ctx.repositories.Section.undelete(args.input.id),
    createSectionIntroduction: (
      _,
      { input: { sectionId, introductionContent, introductionTitle } },
      ctx
    ) =>
      ctx.repositories.Section.update({
        id: sectionId,
        introductionEnabled: true,
        introductionContent,
        introductionTitle,
      }),
    updateSectionIntroduction: (
      _,
      { input: { sectionId, introductionContent, introductionTitle } },
      ctx
    ) =>
      ctx.repositories.Section.update({
        id: sectionId,
        introductionContent,
        introductionTitle,
      }),
    deleteSectionIntroduction: (_, { input: { sectionId } }, ctx) =>
      ctx.repositories.Section.update({
        id: sectionId,
        introductionEnabled: false,
        introductionContent: null,
        introductionTitle: null,
      }),

    moveSection: (_, { input }, ctx) => {
      const removedSection = first(
        remove(ctx.questionnaire.sections, { id: input.id })
      );
      ctx.questionnaire.sections.splice(input.position, 0, removedSection);
      save(ctx.questionnaire);
      return removedSection;
    },

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
      const removedPage = first(remove(section.pages, { id: input.id }));
      save(ctx.questionnaire);
      return removedPage;
    },
    undeletePage: (_, args, ctx) =>
      ctx.repositories.Page.undelete(args.input.id),

    movePage: (_, { input }, ctx) => {
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
      save(ctx.questionnaire);
      return removedPage;
    },

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
    updateAnswer: (root, { input }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      const answers = flatMap(pages, page => page.answers);

      const additionalAnswers = flatMap(answers, answer => {
        return flatMap(answer.options, option => option.additionalAnswer);
      });

      const answer = find(concat(answers, additionalAnswers), { id: input.id });
      merge(answer, input);
      save(ctx.questionnaire);

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
      save(ctx.questionnaire);
      return deletedAnswer;

      // await ctx.modifiers.BinaryExpression.onAnswerDeleted(deletedAnswer); // TODO
    },
    undeleteAnswer: (_, args, ctx) =>
      ctx.repositories.Answer.undelete(args.input.id),

    createOption: async (root, { input }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      const answers = flatMap(pages, page => page.answers);
      const parent = find(answers, { id: input.answerId });
      const option = createOption(input);

      parent.options.push(option);

      save(ctx.questionnaire);

      return option;
    },

    createMutuallyExclusiveOption: (root, { input }, ctx) => {
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

      save(ctx.questionnaire);

      return option;
    },
    updateOption: (_, { input }, ctx) => {
      const pages = flatMap(
        ctx.questionnaire.sections,
        section => section.pages
      );
      const answers = flatMap(pages, page => page.answers);
      const options = flatMap(answers, answer => answer.options);
      const option = find(options, { id: input.id });

      merge(option, input);

      save(ctx.questionnaire);

      return option;
    },
    deleteOption: (_, { input }, ctx) => {
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

      save(ctx.questionnaire);

      return removedOption;
    },
    undeleteOption: (_, args, ctx) =>
      ctx.repositories.Option.undelete(args.input.id),
    toggleValidationRule: (_, args, ctx) => {
      const validation = getValidation(ctx)(args.input.id);
      validation.enabled = args.input.enabled;
      merge(validation, args.input);
      save(ctx.questionnaire);

      return validation;
    },
    updateValidationRule: (_, args, ctx) => {
      const validation = getValidation(ctx)(args.input.id);
      VALIDATION_INPUT_TYPES.map(type => {
        merge(validation, args.input[type]);
      });
      save(ctx.questionnaire);

      return validation;
    },
    createMetadata: (root, args, ctx) => {
      const newMetadata = {
        alias: null,
        id: uuid.v4(),
        key: null,
        type: "Text",
        value: null,
      };
      ctx.questionnaire.metadata.push(newMetadata);
      save(ctx.questionnaire);
      return newMetadata;
    },
    updateMetadata: (_, { input }, ctx) => {
      const original = find(ctx.questionnaire.metadata, { id: input.id });
      const result = updateMetadata(original, input);
      merge(original, result);
      save(ctx.questionnaire);
      return result;
    },
    deleteMetadata: (_, { input }, ctx) => {
      const deletedMetadata = first(
        remove(ctx.questionnaire.metadata, {
          id: input.id,
        })
      );
      save(ctx.questionnaire);
      return deletedMetadata;
    },

    createQuestionConfirmation: (_, { input }, ctx) => {
      const section = findSectionByPageId(
        ctx.questionnaire.sections,
        input.pageId
      );
      const page = find(section.pages, { id: input.pageId });
      const questionConfimation = {
        id: uuid.v4(),
        title: "",
        positive: { label: null, description: null },
        negative: { label: null, description: null },
        availablePipingAnswers: [],
        availablePipingMetadata: [],
      };
      set(page, "confirmation", questionConfimation);
      save(ctx.questionnaire);
      return {
        pageId: input.pageId,
        ...questionConfimation,
      };
    },
    updateQuestionConfirmation: (
      _,
      { input: { positive, negative, id, title } },
      ctx
    ) => {
      const newValues = {
        title,
        positiveLabel: positive.label,
        positiveDescription: positive.description,
        negativeLabel: negative.label,
        negativeDescription: negative.description,
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

      save(ctx.questionnaire);

      return {
        pageId,
        ...confirmationPage,
      };
    },
    deleteQuestionConfirmation: (_, { input }, ctx) => {
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
      save(ctx.questionnaire);

      return {
        pageId: pageContainingConfirmation.id,
        ...confirmationPage,
      };
    },
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
    introduction: section => (section.introductionEnabled ? section : null),
    availablePipingAnswers: ({ id }, args, ctx) =>
      getPreviousAnswersForSection(ctx.questionnaire, id),
    availablePipingMetadata: (section, args, ctx) => ctx.questionnaire.metadata,
  },

  SectionIntroduction: {
    section: ({ id: sectionId }, args, ctx) => {
      return ctx.repositories.Section.getById(sectionId);
    },
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
    title: (page, args) => formatRichText(page.title, args.format),
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
      } else if (includes(["DateRange"], type)) {
        return "CompositeAnswer";
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
    previousAnswer: ({ previousAnswerId }, args, ctx) =>
      isNil(previousAnswerId)
        ? null
        : ctx.repositories.Answer.getById(previousAnswerId),
    availablePreviousAnswers: ({ id }, args, ctx) =>
      ctx.repositories.Validation.getPreviousAnswersForValidation(id),
  },

  MaxValueValidationRule: {
    enabled: ({ enabled }) => enabled,
    inclusive: ({ inclusive }) => inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswerId }, args, ctx) =>
      isNil(previousAnswerId)
        ? null
        : ctx.repositories.Answer.getById(previousAnswerId),
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
