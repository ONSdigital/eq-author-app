const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
const {
  compact,
  includes,
  isNil,
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
} = require("lodash");
const GraphQLJSON = require("graphql-type-json");
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
const { ANSWERS, OPTIONS } = require("../../constants/validationErrorTypes");

const {
  createQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  getUserById,
  listUsers,
} = require("../../utils/datastore");

const {
  createDefaultBusinessSurveyMetadata,
} = require("../../utils/defaultMetadata");

const { listQuestionnaires } = require("../../utils/datastore");

const {
  createQuestionnaireIntroduction,
} = require("./questionnaireIntroduction");

const {
  withWritePermission,
  enforceHasWritePermission,
  hasWritePermission,
} = require("./withWritePermission");

const getQuestionnaireList = () => {
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
    theme: "default",
    legalBasis: "Voluntary",
    navigation: false,
    createdAt: new Date(),
    metadata: [],
    sections: [createSection()],
    summary: false,
    version: currentVersion,
    editors: [],
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
    me: (root, args, ctx) => ctx.user,
    users: () => listUsers(),
  },

  Mutation: {
    createQuestionnaire: async (root, args, ctx) => {
      const questionnaire = createNewQuestionnaire({
        ...args.input,
        createdBy: ctx.user.id,
      });
      // Saving to ctx so it can be used by all other resolvers and read by tests
      ctx.questionnaire = await createQuestionnaire(questionnaire);
      return ctx.questionnaire;
    },
    updateQuestionnaire: withWritePermission((_, { input }, ctx) =>
      Object.assign(ctx.questionnaire, input)
    ),
    deleteQuestionnaire: async (_, { input }, ctx) => {
      enforceHasWritePermission(ctx.questionnaire, ctx.user);
      await deleteQuestionnaire(input.id);
      ctx.questionnaire = null;
      return { id: input.id };
    },

    duplicateQuestionnaire: async (_, { input }, ctx) => {
      const questionnaire = await getQuestionnaire(input.id);
      const newQuestionnaire = {
        ...questionnaire,
        title: addPrefix(questionnaire.title),
        shortTitle: addPrefix(questionnaire.shortTitle),
        id: uuid.v4(),
        createdBy: ctx.user.id,
        editors: [],
      };
      return createQuestionnaire(newQuestionnaire);
    },
    createSection: withWritePermission((root, { input }, ctx) => {
      const section = createSection(input);
      ctx.questionnaire.sections.push(section);
      return section;
    }),
    updateSection: withWritePermission((_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      merge(section, input);
      return section;
    }),
    deleteSection: withWritePermission((root, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      remove(ctx.questionnaire.sections, section);
      return section;
    }),
    moveSection: withWritePermission((_, { input }, ctx) => {
      const removedSection = first(
        remove(ctx.questionnaire.sections, { id: input.id })
      );
      ctx.questionnaire.sections.splice(input.position, 0, removedSection);
      return removedSection;
    }),
    duplicateSection: withWritePermission((_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      const newSection = omit(cloneDeep(section), "id");
      set(newSection, "alias", addPrefix(newSection.alias));
      set(newSection, "title", addPrefix(newSection.title));
      const duplicatedSection = createSection(newSection);
      const remappedSection = remapAllNestedIds(duplicatedSection);
      ctx.questionnaire.sections.splice(input.position, 0, remappedSection);
      return remappedSection;
    }),
    createAnswer: withWritePermission((root, { input }, ctx) => {
      const page = getPageById(ctx, input.questionPageId);
      const answer = createAnswer(input, page);

      page.answers.push(answer);

      onAnswerCreated(page, answer);

      return answer;
    }),
    updateAnswer: withWritePermission((root, { input }, ctx) => {
      const answers = getAnswers(ctx);

      const additionalAnswers = flatMap(answers, answer =>
        answer.options
          ? flatMap(answer.options, option => option.additionalAnswer)
          : null
      );

      const answer = find(concat(answers, additionalAnswers), { id: input.id });
      merge(answer, input);

      return answer;
    }),
    updateAnswersOfType: withWritePermission(
      (root, { input: { questionPageId, type, properties } }, ctx) => {
        const page = getPageById(ctx, questionPageId);
        const answersOfType = page.answers.filter(a => a.type === type);
        answersOfType.forEach(answer => {
          answer.properties = {
            ...answer.properties,
            ...properties,
          };
        });

        return answersOfType;
      }
    ),
    deleteAnswer: withWritePermission((_, { input }, ctx) => {
      const pages = getPages(ctx);
      const page = find(pages, page => {
        if (page.answers && some(page.answers, { id: input.id })) {
          return page;
        }
      });

      const deletedAnswer = first(remove(page.answers, { id: input.id }));

      onAnswerDeleted(page, deletedAnswer);

      return page;
    }),
    moveAnswer: withWritePermission((_, { input: { id, position } }, ctx) => {
      const pages = getPages(ctx);
      const page = find(pages, page => {
        if (page.answers && some(page.answers, { id })) {
          return page;
        }
      });

      const answerMoving = first(remove(page.answers, { id }));
      page.answers.splice(position, 0, answerMoving);

      return answerMoving;
    }),

    createOption: withWritePermission((root, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = flatMap(pages, page => page.answers);
      const parent = find(answers, { id: input.answerId });
      const option = createOption(input);

      parent.options.push(option);

      return option;
    }),

    createMutuallyExclusiveOption: withWritePermission(
      (root, { input }, ctx) => {
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

        return option;
      }
    ),
    updateOption: withWritePermission((_, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = compact(flatMap(pages, page => page.answers));
      const options = flatMap(answers, answer => answer.options);
      const option = find(options, { id: input.id });

      merge(option, input);

      return option;
    }),
    deleteOption: withWritePermission((_, { input }, ctx) => {
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

      return removedOption;
    }),
    toggleValidationRule: withWritePermission((_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      validation.enabled = args.input.enabled;

      const newValidation = Object.assign({}, validation);
      delete validation.validationType;

      return newValidation;
    }),
    updateValidationRule: withWritePermission((_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      const { validationType } = validation;

      merge(validation, args.input[`${validationType}Input`]);

      const newValidation = Object.assign({}, validation);
      delete validation.validationType;

      return newValidation;
    }),
    createMetadata: withWritePermission((root, args, ctx) => {
      const newMetadata = {
        alias: null,
        id: uuid.v4(),
        key: null,
        type: "Text",
      };
      ctx.questionnaire.metadata.push(newMetadata);
      return newMetadata;
    }),
    updateMetadata: withWritePermission((_, { input }, ctx) => {
      const original = find(ctx.questionnaire.metadata, { id: input.id });
      const result = updateMetadata(original, input);
      merge(original, result);
      return result;
    }),
    deleteMetadata: withWritePermission((_, { input }, ctx) => {
      const deletedMetadata = first(
        remove(ctx.questionnaire.metadata, {
          id: input.id,
        })
      );
      return deletedMetadata;
    }),
    createQuestionConfirmation: withWritePermission((_, { input }, ctx) => {
      const section = getSectionByPageId(ctx, input.pageId);
      const page = find(section.pages, { id: input.pageId });
      const questionConfirmation = {
        id: uuid.v4(),
        title: "",
        positive: { label: null, description: null },
        negative: { label: null, description: null },
      };
      set(page, "confirmation", questionConfirmation);
      return {
        pageId: input.pageId,
        ...questionConfirmation,
      };
    }),
    updateQuestionConfirmation: withWritePermission(
      (_, { input: { positive, negative, id, title } }, ctx) => {
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

        return {
          pageId,
          ...confirmationPage,
        };
      }
    ),
    deleteQuestionConfirmation: withWritePermission((_, { input }, ctx) => {
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

      return {
        pageId: pageContainingConfirmation.id,
        ...confirmationPage,
      };
    }),
  },

  Questionnaire: {
    sections: questionnaire => questionnaire.sections,
    createdBy: questionnaire => getUserById(questionnaire.createdBy),
    questionnaireInfo: questionnaire => questionnaire,
    metadata: questionnaire => questionnaire.metadata,
    displayName: questionnaire =>
      questionnaire.shortTitle || questionnaire.title,
    editors: questionnaire =>
      Promise.all(
        (questionnaire.editors || []).map(editorId => getUserById(editorId))
      ),
    permission: (questionnaire, args, ctx) => {
      if (hasWritePermission(questionnaire, ctx.user)) {
        return "Write";
      }
      return "Read";
    },
  },

  User: {
    displayName: user => user.name || user.email,
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

    validationErrorInfo: (answer, args, ctx) => {
      return ctx.validationErrorInfo.filter(
        errorInfo => errorInfo.id === answer.id && errorInfo.type === ANSWERS
      );
    },
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
    validationErrorInfo: (option, args, ctx) => {
      return ctx.validationErrorInfo.filter(
        errorInfo => errorInfo.id === option.id && errorInfo.type === OPTIONS
      );
    },
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
  DateTime: GraphQLDateTime,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
