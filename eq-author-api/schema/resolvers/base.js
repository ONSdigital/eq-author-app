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
const uuid = require("uuid");
const { withFilter } = require("apollo-server-express");
const fetch = require("node-fetch");

const { UNPUBLISHED, PUBLISHED } = require("../../constants/publishStatus");
const pubsub = require("../../db/pubSub");
const { getName } = require("../../utils/getName");
const {
  getValidationEntity,
} = require("../../src/businessLogic/createValidation");
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
const onPageDeleted = require("../../src/businessLogic/onPageDeleted");
const addPrefix = require("../../utils/addPrefix");
const { createQuestionPage } = require("./pages/questionPage");

const { BUSINESS } = require("../../constants/questionnaireTypes");
const {
  ANSWERS,
  OPTIONS,
  SECTIONS,
  CONFIRMATION,
  CONFIRMATION_OPTION,
  VALIDATION,
} = require("../../constants/validationErrorTypes");

const {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  getUserById,
  listUsers,
} = require("../../utils/datastore");

const {
  createDefaultBusinessSurveyMetadata,
} = require("../../utils/defaultMetadata");

const { listQuestionnaires } = require("../../utils/datastore");

const createQuestionnaireIntroduction = require("../../utils/createQuestionnaireIntroduction");

const {
  enforceHasWritePermission,
  hasWritePermission,
} = require("./withWritePermission");
const { createMutation } = require("./createMutation");

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
    isPublic: true,
    publishStatus: UNPUBLISHED,
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
    questionnaires: async (root, args, ctx) => {
      const questionnaires = await listQuestionnaires();

      return questionnaires.filter(questionnaire => {
        if (ctx.user.admin === true || questionnaire.isPublic) {
          return true;
        }

        return [questionnaire.createdBy, ...questionnaire.editors].includes(
          ctx.user.id
        );
      });
    },
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
    triggerPublish: async (root, { input }, ctx) => {
      const { questionnaireId, surveyId, formType } = input;
      enforceHasWritePermission(ctx.questionnaire, ctx.user);
      const result = await fetch(
        `${process.env.SURVEY_REGISTER_URL}${questionnaireId}/${surveyId}/${formType}`,
        { method: "put" }
      )
        .then(async res => {
          ctx.questionnaire.publishStatus = PUBLISHED;
          await saveQuestionnaire(ctx.questionnaire);
          return res.json();
        })
        .catch(e => {
          throw Error(e);
        });
      return {
        id: questionnaireId,
        launchUrl: result.publishedSurveyUrl,
      };
    },
  },

  Subscription: {
    validationUpdated: {
      resolve: ({ questionnaire, validationErrorInfo, user }, args, ctx) => {
        ctx.questionnaire = questionnaire;
        ctx.validationErrorInfo = validationErrorInfo;
        ctx.user = user;
        return questionnaire;
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(["validationUpdated"]),
        (payload, variables, ctx) => {
          // user in payload not ctx on createQuestionnaire
          // this covers scenario where changing to private is done immediately on createQuestionnaire
          const user = ctx.user || payload.user;
          const { questionnaire } = payload;
          if (
            questionnaire.isPublic ||
            [questionnaire.createdBy, ...questionnaire.editors].includes(
              user.id
            )
          ) {
            return questionnaire.id === variables.id;
          }
          return false;
        }
      ),
    },
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
    updateQuestionnaire: createMutation((_, { input }, ctx) =>
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
    createSection: createMutation((root, { input }, ctx) => {
      const section = createSection(input);
      ctx.questionnaire.sections.push(section);
      return section;
    }),
    updateSection: createMutation((_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      merge(section, input);
      return section;
    }),
    deleteSection: createMutation((root, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      remove(ctx.questionnaire.sections, section);
      onPageDeleted(ctx, input.id);
      return ctx.questionnaire;
    }),
    moveSection: createMutation((_, { input }, ctx) => {
      const removedSection = first(
        remove(ctx.questionnaire.sections, { id: input.id })
      );
      ctx.questionnaire.sections.splice(input.position, 0, removedSection);
      return removedSection;
    }),
    duplicateSection: createMutation((_, { input }, ctx) => {
      const section = find(ctx.questionnaire.sections, { id: input.id });
      const newSection = omit(cloneDeep(section), "id");
      set(newSection, "alias", addPrefix(newSection.alias));
      set(newSection, "title", addPrefix(newSection.title));
      const duplicatedSection = createSection(newSection);
      const remappedSection = remapAllNestedIds(duplicatedSection);
      ctx.questionnaire.sections.splice(input.position, 0, remappedSection);
      return remappedSection;
    }),
    createAnswer: createMutation((root, { input }, ctx) => {
      const page = getPageById(ctx, input.questionPageId);
      const answer = createAnswer(input, page);

      page.answers.push(answer);

      onAnswerCreated(page, answer);

      return answer;
    }),
    updateAnswer: createMutation((root, { input }, ctx) => {
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
    updateAnswersOfType: createMutation(
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
    deleteAnswer: createMutation((_, { input }, ctx) => {
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
    moveAnswer: createMutation((_, { input: { id, position } }, ctx) => {
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

    createOption: createMutation((root, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = flatMap(pages, page => page.answers);
      const parent = find(answers, { id: input.answerId });
      const option = createOption(input);

      parent.options.push(option);

      return option;
    }),

    createMutuallyExclusiveOption: createMutation((root, { input }, ctx) => {
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
    }),

    moveOption: createMutation((_, { input: { id, position } }, ctx) => {
      const pages = getPages(ctx);
      const answers = compact(flatMap(pages, page => page.answers));
      const answer = find(answers, answer => {
        if (answer.options && some(answer.options, { id })) {
          return answer;
        }
      });

      const options = answer.options;

      const optionMoving = first(remove(options, { id }));
      options.splice(position, 0, optionMoving);

      return answer;
    }),

    updateOption: createMutation((_, { input }, ctx) => {
      const pages = getPages(ctx);
      const answers = compact(flatMap(pages, page => page.answers));
      const options = flatMap(answers, answer => answer.options);
      const option = find(options, { id: input.id });

      merge(option, input);

      return option;
    }),
    deleteOption: createMutation((_, { input }, ctx) => {
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

      return answer;
    }),
    toggleValidationRule: createMutation((_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      validation.enabled = args.input.enabled;
      const newValidation = Object.assign({}, validation);

      delete validation.validationType;

      return newValidation;
    }),
    updateValidationRule: createMutation((_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      const { validationType } = validation;

      merge(validation, args.input[`${validationType}Input`]);

      const newValidation = Object.assign({}, validation);
      delete validation.validationType;

      return newValidation;
    }),
    createMetadata: createMutation((root, args, ctx) => {
      const newMetadata = {
        alias: null,
        id: uuid.v4(),
        key: null,
        type: "Text",
      };
      ctx.questionnaire.metadata.push(newMetadata);
      return newMetadata;
    }),
    updateMetadata: createMutation((_, { input }, ctx) => {
      const original = find(ctx.questionnaire.metadata, { id: input.id });
      const result = updateMetadata(original, input);
      merge(original, result);
      return result;
    }),
    deleteMetadata: createMutation((_, { input }, ctx) => {
      const deletedMetadata = first(
        remove(ctx.questionnaire.metadata, {
          id: input.id,
        })
      );
      return deletedMetadata;
    }),
    createQuestionConfirmation: createMutation((_, { input }, ctx) => {
      const section = getSectionByPageId(ctx, input.pageId);
      const page = find(section.pages, { id: input.pageId });
      const questionConfirmation = {
        id: uuid.v4(),
        title: "",
        positive: { id: uuid.v4(), label: "", description: "" },
        negative: { id: uuid.v4(), label: "", description: "" },
      };
      set(page, "confirmation", questionConfirmation);
      return {
        pageId: input.pageId,
        ...questionConfirmation,
      };
    }),
    updateQuestionConfirmation: createMutation(
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
    deleteQuestionConfirmation: createMutation((_, { input }, ctx) => {
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
    totalErrorCount: (questionnaire, args, ctx) =>
      ctx.validationErrorInfo.totalCount,
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
    title: (section, args, ctx) =>
      ctx.questionnaire.navigation ? section.title : "",
    displayName: (section, args, ctx) =>
      ctx.questionnaire.navigation
        ? getName(section, "Section")
        : getName(omit(section, "title"), "Section"),
    position: ({ id }, args, ctx) => {
      return findIndex(ctx.questionnaire.sections, { id });
    },
    availablePipingAnswers: ({ id }, args, ctx) =>
      getPreviousAnswersForSection(ctx.questionnaire, id),
    availablePipingMetadata: (section, args, ctx) => ctx.questionnaire.metadata,
    validationErrorInfo: ({ id }, args, ctx) =>
      ctx.validationErrorInfo[SECTIONS][id] || {
        id,
        errors: [],
        totalCount: 0,
      },
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

    validationErrorInfo: ({ id }, args, ctx) =>
      ctx.validationErrorInfo[ANSWERS][id] || {
        id,
        errors: [],
        totalCount: 0,
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
    validationErrorInfo: ({ id }, args, ctx) =>
      ctx.validationErrorInfo[OPTIONS][id] || {
        id,
        errors: [],
        totalCount: 0,
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
    validationErrorInfo: ({ id }, args, ctx) =>
      ctx.validationErrorInfo[VALIDATION][id] || {
        id: id,
        errors: [],
        totalCount: 0,
      },
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
    validationErrorInfo: ({ id }, args, ctx) =>
      ctx.validationErrorInfo[VALIDATION][id] || {
        id: id,
        errors: [],
        totalCount: 0,
      },
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
    validationErrorInfo: ({ id }, args, ctx) =>
      ctx.validationErrorInfo[CONFIRMATION][id] || {
        id,
        errors: [],
        totalCount: 0,
      },
  },

  ConfirmationOption: {
    validationErrorInfo: ({ id }, args, ctx) =>
      ctx.validationErrorInfo[CONFIRMATION_OPTION][id] || {
        id,
        errors: [],
        totalCount: 0,
      },
  },

  Date: GraphQLDate,
  DateTime: GraphQLDateTime,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
