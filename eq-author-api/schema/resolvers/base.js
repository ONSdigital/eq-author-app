const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
const { SOCIAL } = require("../../constants/questionnaireTypes");
const {
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
const { v4: uuidv4 } = require("uuid");
const { withFilter, UserInputError } = require("apollo-server-express");
const fetch = require("node-fetch");

const {
  UNPUBLISHED,
  PUBLISHED,
  AWAITING_APPROVAL,
  UPDATES_REQUIRED,
} = require("../../constants/publishStatus");

const { DURATION_LOOKUP } = require("../../constants/durationTypes");
const { DATE, CHECKBOX, RADIO } = require("../../constants/answerTypes");

const pubsub = require("../../db/pubSub");
const { getName } = require("../../utils/getName");
const {
  getValidationEntity,
} = require("../../src/businessLogic/createValidation");
const { currentVersion } = require("../../migrations");

const {
  createExpression,
  createExpressionGroup,
  createLeftSide,
  createFolder,
  createSection,
  createTheme,
  createList,
} = require("../../src/businessLogic");

const {
  getExpressions,
  getSections,
  getSectionById,
  getFolderById,
  getSectionByFolderId,
  getPages,
  getPageById,
  getPageByAnswerId,
  getPageByConfirmationId,
  getAnswers,
  getAnswerById,
  getOptionById,
  getConfirmationById,
  getValidationById,
  getSkippables,
  getSkippableById,
  remapAllNestedIds,
  returnValidationErrors,
  getThemeByShortName,
  getPreviewTheme,
  getFirstEnabledTheme,
  getListById,
  getListByAnswerId,
} = require("./utils");

const createAnswer = require("../../src/businessLogic/createAnswer");
const onAnswerCreated = require("../../src/businessLogic/onAnswerCreated");
const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");
const onAnswerUpdated = require("../../src/businessLogic/onAnswerUpdated");
const updateMetadata = require("../../src/businessLogic/updateMetadata");
const deleteMetadata = require("../../src/businessLogic/deleteMetadata");
const createOption = require("../../src/businessLogic/createOption");
const onSectionDeleted = require("../../src/businessLogic/onSectionDeleted");
const onFolderDeleted = require("../../src/businessLogic/onFolderDeleted");
const addPrefix = require("../../utils/addPrefix");
const onQuestionnaireUpdated = require("../../src/businessLogic/onQuestionnaireUpdated");

const { BUSINESS } = require("../../constants/questionnaireTypes");

const {
  createQuestionnaire,
  saveQuestionnaire,
  deleteQuestionnaire,
  getQuestionnaire,
  getUserById,
  listUsers,
  createHistoryEvent,
  getQuestionnaireMetaById,
  createComments,
  saveMetadata,
  saveComments,
  getCommentsForQuestionnaire,
  updateUser,
} = require("../../db/datastore");

const {
  createDefaultBusinessSurveyMetadata,
} = require("../../utils/defaultMetadata");

const { listQuestionnaires } = require("../../db/datastore");

const createQuestionnaireIntroduction = require("../../utils/createQuestionnaireIntroduction");
const createSubmission = require("../../utils/createSubmission");

const {
  enforceHasWritePermission,
  hasWritePermission,
  enforceHasAdminPermission,
  enforceQuestionnaireLocking,
} = require("./withPermissions");
const { createMutation } = require("./createMutation");

const {
  noteCreationEvent,
  publishStatusEvent,
} = require("../../utils/questionnaireEvents");

const { THEME_SHORT_NAMES } = require("../../constants/themes");

const deleteFirstPageSkipConditions = require("../../src/businessLogic/deleteFirstPageSkipConditions");
const deleteLastPageRouting = require("../../src/businessLogic/deleteLastPageRouting");

const createNewQuestionnaire = (input) => {
  const defaultTheme = createTheme({
    shortName: input.type === BUSINESS ? "default" : "social",
  });
  const defaultQuestionnaire = {
    id: uuidv4(),
    theme: "default",
    qcodes: true,
    navigation: false,
    hub: false,
    createdAt: new Date(),
    metadata: [],
    sections: [createSection()],
    summary: false,
    version: currentVersion,
    surveyVersion: 1,
    editors: [],
    isPublic: true,
    publishStatus: UNPUBLISHED,
    collectionLists: {
      id: uuidv4(),
      lists: [],
    },
    themeSettings: {
      id: uuidv4(),
      previewTheme: defaultTheme.shortName,
      themes: [defaultTheme],
    },
    locked: false,
    submission: createSubmission(),
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

const publishCommentUpdates = (questionnaireId) => {
  pubsub.publish("commentsUpdated", {
    questionnaireId,
  });
};

const Resolvers = {
  Query: {
    questionnaires: async (root, { input = {} }, ctx) => {
      /**
       * Resolver logic
       */

      let questionnaires = await listQuestionnaires();

      questionnaires = questionnaires.filter((questionnaire) => {
        if (ctx.user.admin === true || questionnaire.isPublic) {
          return true;
        }

        return [questionnaire.createdBy, ...questionnaire.editors].includes(
          ctx.user.id
        );
      });

      /**
       * Check if query supplied any filters; if no, return unfiltered list.
       */

      const { filter } = input;

      const shouldApplyFilter = filter !== null && filter !== undefined;

      if (!shouldApplyFilter) {
        return questionnaires;
      }

      /**
       * If yes, check which filter to apply and return filtered list.
       */

      const shouldApplyNeIdsFilter =
        filter.ne?.ids !== null &&
        filter.ne?.ids !== undefined &&
        filter.ne?.ids !== [];

      if (shouldApplyNeIdsFilter) {
        const ids = filter.ne.ids;

        questionnaires = questionnaires.filter(
          (questionnaire) => !ids.includes(questionnaire.id)
        );
      }

      return questionnaires;
    },
    questionnaire: async (root, { input }, ctx) => {
      /**
       * If we have asked for a different questionnaire, go and get it.
       */
      if (input.questionnaireId) {
        const questionnaire = await getQuestionnaire(input.questionnaireId);

        if (questionnaire) {
          /**
           * Update CTX so custom resolvers can run correctly.
           */
          ctx.questionnaire = questionnaire;
        } else {
          ctx.questionnaire = null;
        }
      }

      return ctx.questionnaire;
    },
    history: async (root, { input }) =>
      getQuestionnaireMetaById(input.questionnaireId).then(
        ({ history }) => history
      ),
    section: (root, { input }, ctx) => getSectionById(ctx, input.sectionId),
    folder: (root, { input }, ctx) => getFolderById(ctx, input.folderId),
    page: (root, { input }, ctx) =>
      getPageById(ctx, input.pageId, input.includeSelf),
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
    comments: async (root, { id }, ctx) => {
      const questionnaireId = ctx.questionnaire.id;
      const { comments } = await getCommentsForQuestionnaire(questionnaireId);

      if (comments[id]) {
        return comments[id];
      }
      return [];
    },
    skippable: (root, { input: { id } }, ctx) => getSkippableById(ctx, id),
    submission: (root, _, ctx) => ctx.questionnaire.submission,
    collectionLists: (_, args, ctx) => ctx.questionnaire.collectionLists,
    list: (root, { input: { listId } }, ctx) =>
      find(ctx.questionnaire.collectionLists.lists, { id: listId }),
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
    publishStatusUpdated: {
      resolve: ({ questionnaire }, args, ctx) => {
        ctx.questionnaire = questionnaire;
        return questionnaire;
      },
      subscribe: () => pubsub.asyncIterator(["publishStatusUpdated"]),
    },
    lockStatusUpdated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(["lockStatusUpdated"]),
        ({ id }, input) => input.id === null || id === input.id
      ),
      resolve: (questionnaire) => questionnaire,
    },
    commentsUpdated: {
      resolve: ({ questionnaireId }) => {
        return { id: questionnaireId };
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(["commentsUpdated"]),
        (payload, variables) => {
          return payload.questionnaireId === variables.id;
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

      await createComments(questionnaire.id);
      // Saving to ctx so it can be used by all other resolvers and read by tests
      ctx.questionnaire = await createQuestionnaire(questionnaire, ctx);

      return ctx.questionnaire;
    },
    updateQuestionnaire: createMutation((_, { input }, ctx) => {
      Object.assign(ctx.questionnaire, input);
      onQuestionnaireUpdated(ctx.questionnaire);

      return ctx.questionnaire;
    }),
    toggleQuestionnaireStarred: async (root, { input }, ctx) => {
      const { questionnaireId } = input;
      const questionnaire = await getQuestionnaire(questionnaireId);
      if (!questionnaire) {
        throw new UserInputError(
          `Questionnaire with ID ${questionnaireId} does not exist.`
        );
      }

      const starredQuestionnaires = ctx.user.starredQuestionnaires || [];
      const existingStarIndex = starredQuestionnaires.findIndex(
        (id) => id === questionnaireId
      );

      if (existingStarIndex > -1) {
        starredQuestionnaires.splice(existingStarIndex, 1);
      } else {
        starredQuestionnaires.push(questionnaireId);
      }

      ctx.user.starredQuestionnaires = starredQuestionnaires;
      await updateUser(ctx.user);

      return questionnaire;
    },
    setQuestionnaireLocked: async (root, { input }, ctx) => {
      const { questionnaireId, locked } = input;
      const questionnaire = await getQuestionnaire(questionnaireId);
      if (!questionnaire) {
        throw new UserInputError(
          `Questionnaire with ID ${questionnaireId} does not exist.`
        );
      }

      enforceHasWritePermission(questionnaire, ctx.user);
      questionnaire.locked = locked;
      await saveQuestionnaire(questionnaire);

      pubsub.publish("lockStatusUpdated", questionnaire);
      return questionnaire;
    },
    deleteQuestionnaire: async (_, { input }, ctx) => {
      if (!ctx.questionnaire) {
        const questionnaire = await getQuestionnaire(input.id);
        ctx.questionnaire = questionnaire;
      }
      enforceHasWritePermission(ctx.questionnaire, ctx.user); // throws ForbiddenError
      enforceQuestionnaireLocking(ctx.questionnaire); // throws ForbiddenError

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
        id: uuidv4(),
        createdBy: ctx.user.id,
        createdAt: new Date(),
        editors: [],
        publishStatus: UNPUBLISHED,
        surveyVersion: 1,
        locked: false,
      };
      return createQuestionnaire(newQuestionnaire, ctx);
    },
    updateSurveyId: createMutation((root, { input: { surveyId } }, ctx) => {
      ctx.questionnaire.surveyId = surveyId;
      return ctx.questionnaire;
    }),
    updateSubmission: createMutation((root, { input }, ctx) => {
      ctx.questionnaire.submission = {
        ...ctx.questionnaire.submission,
        ...input,
      };

      return ctx.questionnaire.submission;
    }),
    updatePreviewTheme: createMutation(
      (root, { input: { previewTheme } }, ctx) => {
        ctx.questionnaire.themeSettings.previewTheme = previewTheme;
        return ctx.questionnaire.themeSettings;
      }
    ),
    enableTheme: createMutation((root, { input: { shortName } }, ctx) => {
      let theme = getThemeByShortName(ctx, shortName);
      if (!theme) {
        theme = createTheme({ shortName });
        ctx.questionnaire.themeSettings.themes.push(theme);
      }
      theme.enabled = true;

      const openThemes = ctx.questionnaire.themeSettings.themes.filter(
        (theme) => theme.enabled === true
      );
      if (openThemes.length === 1) {
        ctx.questionnaire.themeSettings.previewTheme = shortName;
      }

      return theme;
    }),
    updateTheme: createMutation((root, { input }, ctx) => {
      const theme = getThemeByShortName(ctx, input.shortName);

      // Trim whitespace from input
      for (const key of Object.keys(input)) {
        input[key] = input[key]?.trim() ?? input[key];
      }

      if (!theme) {
        throw new UserInputError(
          `updateTheme: No theme found with shortName '${input.shortName}''`
        );
      }
      delete input.questionnaireId;
      return Object.assign(theme, input);
    }),
    disableTheme: createMutation((root, { input: { shortName } }, ctx) => {
      const theme = getThemeByShortName(ctx, shortName);
      if (!theme) {
        throw new UserInputError(
          `disableTheme: No theme found with shortName '${shortName}''`
        );
      }

      theme.enabled = false;

      const isPreviewTheme = getPreviewTheme(ctx) === shortName;

      if (isPreviewTheme) {
        const { shortName } = getFirstEnabledTheme(ctx) || {};

        if (shortName) {
          ctx.questionnaire.themeSettings.previewTheme = shortName;
        }
      }

      return theme;
    }),
    createHistoryNote: (root, { input }, ctx) =>
      createHistoryEvent(input.id, noteCreationEvent(ctx, input.bodyText)),
    updateHistoryNote: async (root, { input }, ctx) => {
      const user = ctx.user;
      const metadata = await getQuestionnaireMetaById(input.questionnaireId);

      const noteToUpdate = metadata.history.find(({ id }) => id === input.id);

      if (!user.admin && user.id !== noteToUpdate.userId) {
        throw new Error("User doesnt have access");
      }
      if (noteToUpdate.type === "system") {
        throw new Error("Cannot update system event message");
      }

      noteToUpdate.bodyText = input.bodyText;

      await saveMetadata(metadata);
      return metadata.history;
    },
    deleteHistoryNote: async (root, { input }, ctx) => {
      const user = ctx.user;
      const metadata = await getQuestionnaireMetaById(input.questionnaireId);
      const history = metadata.history;
      const noteToDelete = history.find((item) => item.id === input.id);

      if (!user.admin && user.id !== noteToDelete.userId) {
        throw new Error("User doesnt have access");
      }
      if (noteToDelete.type === "system") {
        throw new Error("Cannot delete system event message");
      }

      remove(metadata.history, (item) => item.id === noteToDelete.id);

      await saveMetadata(metadata);
      return metadata.history;
    },
    createSection: createMutation((root, { input }, ctx) => {
      const section = createSection(input);
      ctx.questionnaire.sections.push(section);
      return section;
    }),
    updateSection: createMutation((_, { input }, ctx) => {
      const section = getSectionById(ctx, input.id);
      merge(section, input);
      return section;
    }),
    deleteSection: createMutation((root, { input }, ctx) => {
      const removedSection = first(remove(getSections(ctx), { id: input.id }));
      const pages = getPages(ctx);

      onSectionDeleted(ctx, removedSection, pages);

      if (!ctx.questionnaire.sections.length) {
        ctx.questionnaire.sections.push(createSection());
      }
      deleteFirstPageSkipConditions(ctx);
      deleteLastPageRouting(ctx);
      return ctx.questionnaire;
    }),
    moveSection: createMutation((_, { input }, ctx) => {
      const removedSection = first(remove(getSections(ctx), { id: input.id }));
      getSections(ctx).splice(input.position, 0, removedSection);
      deleteFirstPageSkipConditions(ctx);
      deleteLastPageRouting(ctx);
      return ctx.questionnaire;
    }),
    duplicateSection: createMutation((_, { input }, ctx) => {
      const section = getSectionById(ctx, input.id);
      const newSection = omit(cloneDeep(section), "id");
      set(newSection, "alias", addPrefix(newSection.alias));
      set(newSection, "title", addPrefix(newSection.title));
      const duplicatedSection = createSection(newSection);
      const remappedSection = remapAllNestedIds(duplicatedSection);
      ctx.questionnaire.sections.splice(input.position, 0, remappedSection);
      return remappedSection;
    }),
    createFolder: createMutation(
      (root, { input: { isCalcSum, position, ...params } }, ctx) => {
        const folder = createFolder(params, isCalcSum);
        const section = getSectionById(ctx, params.sectionId);
        section.folders.splice(position, 0, folder);
        return folder;
      }
    ),
    updateFolder: createMutation((root, { input }, ctx) => {
      const folder = getFolderById(ctx, input.folderId);
      merge(folder, input);
      return folder;
    }),
    deleteFolder: createMutation((root, { input }, ctx) => {
      const section = getSectionByFolderId(ctx, input.id);
      const removedFolder = first(remove(section.folders, { id: input.id }));
      const pages = getPages(ctx);

      onFolderDeleted(ctx, removedFolder, pages);

      if (!section.folders.length) {
        section.folders.push(createFolder());
      }

      return section;
    }),
    moveFolder: createMutation(
      (_, { input: { id, position, sectionId } }, ctx) => {
        const section = getSectionByFolderId(ctx, id);
        const folderToMove = first(remove(section.folders, { id }));

        if (!section.folders.length) {
          section.folders.push(createFolder());
        }

        if (sectionId) {
          const newSection = getSectionById(ctx, sectionId);
          newSection.folders.splice(position, 0, folderToMove);
        } else {
          section.folders.splice(position, 0, folderToMove);
        }
        return ctx.questionnaire;
      }
    ),
    duplicateFolder: createMutation((_, { input }, ctx) => {
      const section = getSectionByFolderId(ctx, input.id);
      const folder = getFolderById(ctx, input.id);
      const newFolder = omit(cloneDeep(folder), "id");
      set(newFolder, "alias", addPrefix(newFolder.alias));
      const duplicatedFolder = createFolder(newFolder);
      const remappedFolder = remapAllNestedIds(duplicatedFolder);
      section.folders.splice(input.position, 0, remappedFolder);
      return remappedFolder;
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
      const additionalAnswers = flatMap(answers, (answer) =>
        answer.options
          ? flatMap(answer.options, (option) => option.additionalAnswer)
          : null
      );
      const answer = find(concat(answers, additionalAnswers), { id: input.id });
      const oldAnswerLabel = answer.label;
      merge(answer, input);

      if (answer.type === DATE && !input.label && input?.properties?.format) {
        answer.validation.earliestDate.offset.unit =
          DURATION_LOOKUP[input.properties.format];
        answer.validation.latestDate.offset.unit =
          DURATION_LOOKUP[input.properties.format];
      }

      const pages = getPages(ctx);
      onAnswerUpdated(ctx, oldAnswerLabel, input, pages);

      return answer;
    }),
    updateAnswersOfType: createMutation(
      (root, { input: { questionPageId, type, properties } }, ctx) => {
        let page = getPageById(ctx, questionPageId);
        if (!page) {
          page = find(ctx.questionnaire.collectionLists.lists, {
            id: questionPageId,
          });
        }
        const answersOfType = page.answers.filter((a) => a.type === type);
        answersOfType.forEach((answer) => {
          answer.properties = {
            ...answer.properties,
            ...properties,
          };
        });

        return answersOfType;
      }
    ),
    deleteAnswer: createMutation((_, { input }, ctx) => {
      const page = getPageByAnswerId(ctx, input.id);
      const pages = getPages(ctx);
      const deletedAnswer = first(remove(page.answers, { id: input.id }));

      onAnswerDeleted(ctx, page, deletedAnswer, pages);

      return page;
    }),
    moveAnswer: createMutation((_, { input: { id, position } }, ctx) => {
      let object = getPageByAnswerId(ctx, id);
      if (!object) {
        object = getListByAnswerId(ctx, id);
      }
      const answerMoving = first(remove(object.answers, { id }));
      object.answers.splice(position, 0, answerMoving);

      return answerMoving;
    }),
    createOption: createMutation((root, { input }, ctx) => {
      const parent = getAnswerById(ctx, input.answerId);
      const option = createOption(input);
      parent.options.push(option);

      return option;
    }),
    createMutuallyExclusiveOption: createMutation((root, { input }, ctx) => {
      const answer = getAnswerById(ctx, input.answerId);

      const existing = find(answer.options, { mutuallyExclusive: true });
      if (!isNil(existing)) {
        throw new Error(
          "There is already an exclusive checkbox on this answer."
        );
      }

      const option = createOption({ mutuallyExclusive: true, ...input });

      if (!answer.options) {
        answer.options = [];
      }

      answer.options.push(option);

      return option;
    }),
    moveOption: createMutation((_, { input: { id, position } }, ctx) => {
      const answers = getAnswers(ctx);
      const answer = find(answers, (answer) => {
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
      const option = getOptionById(ctx, input.id);

      merge(option, input);

      return option;
    }),
    deleteOption: createMutation((_, { input }, ctx) => {
      const answers = getAnswers(ctx);

      const answer = find(answers, (answer) => {
        if (answer.options && some(answer.options, { id: input.id })) {
          return answer;
        }
      });

      const removedOption = first(remove(answer.options, { id: input.id }));

      getExpressions(ctx).forEach((expression) => {
        if (expression.right && expression.right.optionIds) {
          remove(
            expression.right.optionIds,
            (value) => value === removedOption.id
          );
        }
      });

      if (![CHECKBOX, RADIO].includes(answer.type)) {
        delete answer.options;
      }

      return answer;
    }),
    toggleValidationRule: createMutation((_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      validation.enabled = args.input.enabled;
      if (
        validation.enabled &&
        !validation.custom &&
        !validation.previousAnswer
      ) {
        validation.custom = null;
        validation.previousAnswer = null;
      }
      const newValidation = Object.assign({}, validation);

      delete validation.validationType;
      return newValidation;
    }),
    updateValidationRule: createMutation((_, args, ctx) => {
      const validation = getValidationById(ctx, args.input.id);
      const { validationType } = validation;
      merge(validation, args.input[`${validationType}Input`]);

      return validation;
    }),
    createMetadata: createMutation((root, args, ctx) => {
      const newMetadata = {
        alias: null,
        id: uuidv4(),
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
      const pages = getPages(ctx);

      const deletedMetadata = first(
        remove(ctx.questionnaire.metadata, {
          id: input.id,
        })
      );

      deleteMetadata(deletedMetadata, pages);

      ctx.questionnaire.metadata.forEach((row) => {
        if (row.fallbackKey === deletedMetadata.key) {
          row.fallbackKey = null;
        }
      });

      return deletedMetadata;
    }),
    createQuestionConfirmation: createMutation((_, { input }, ctx) => {
      const page = getPageById(ctx, input.pageId);
      const questionConfirmation = {
        id: uuidv4(),
        title: "",
        positive: { id: uuidv4(), label: "", description: "" },
        negative: { id: uuidv4(), label: "", description: "" },
      };
      set(page, "confirmation", questionConfirmation);
      return {
        pageId: input.pageId,
        ...questionConfirmation,
      };
    }),
    updateQuestionConfirmation: createMutation(
      (_, { input: { positive, negative, id, title, qCode } }, ctx) => {
        const newValues = {
          title,
          positive,
          negative,
          qCode,
        };

        const pages = getPages(ctx);
        let confirmationPage;
        let pageId;

        pages.map((page) => {
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

      pages.map((page) => {
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
    createList: createMutation(async (root, _, ctx) => {
      const list = createList();
      if (!ctx.questionnaire.collectionLists) {
        ctx.questionnaire.collectionLists = {
          id: uuidv4(),
          lists: [],
        };
      }
      ctx.questionnaire.collectionLists.lists.push(list);
      return ctx.questionnaire.collectionLists;
    }),
    updateList: createMutation(async (root, { input }, ctx) => {
      const list = getListById(ctx, input.id);
      list.listName = input.listName;
      return list;
    }),
    deleteList: createMutation(async (root, { input }, ctx) => {
      remove(ctx.questionnaire.collectionLists.lists, { id: input.id });
      return ctx.questionnaire.collectionLists;
    }),
    createListAnswer: createMutation((root, { input }, ctx) => {
      const list = find(ctx.questionnaire.collectionLists.lists, {
        id: input.listId,
      });
      const answer = createAnswer(omit(input, "listId"), list);
      list.answers.push(answer);

      onAnswerCreated(list, answer);

      return list;
    }),
    deleteListAnswer: createMutation((_, { input }, ctx) => {
      const list = getListByAnswerId(ctx, input.id);
      const deletedAnswer = first(remove(list.answers, { id: input.id }));
      const pages = getPages(ctx);

      onAnswerDeleted(ctx, list, deletedAnswer, pages);
      return list;
    }),
    moveListAnswer: createMutation((_, { input: { id, position } }, ctx) => {
      const list = getListByAnswerId(ctx, id);
      const answerMoving = first(remove(list.answers, { id }));
      list.answers.splice(position, 0, answerMoving);

      return answerMoving;
    }),
    triggerPublish: createMutation(async (root, { input }, ctx) => {
      const themeLookup = {
        "Northern Ireland": "northernireland",
        ONS: "default",
        Social: "social",
        "UKIS Northern Ireland": "ukis_ni",
        "UKIS ONS": "ukis",
      };

      const { questionnaireId, surveyId, variants } = input;
      if (
        ctx.questionnaire.publishStatus !== UNPUBLISHED &&
        ctx.questionnaire.publishStatus !== UPDATES_REQUIRED
      ) {
        throw new Error("This questionnaire is not unpublished.");
      }
      if (!surveyId || some(variants, ["formType", null])) {
        throw new Error("Survey Id or a form type is missing");
      }

      const publishDetails = [];

      for (const variant of variants) {
        publishDetails.push({
          surveyId,
          formType: variant.formType,
          variants: [
            {
              language: "en",
              theme: themeLookup[variant.theme],
              // eslint-disable-next-line camelcase
              author_id: questionnaireId,
            },
          ],
        });
      }

      ctx.questionnaire.publishDetails = publishDetails;

      ctx.questionnaire.publishStatus = AWAITING_APPROVAL;

      await createHistoryEvent(ctx.questionnaire.id, publishStatusEvent(ctx));

      return ctx.questionnaire;
    }),
    reviewQuestionnaire: async (root, { input }, ctx) => {
      enforceHasAdminPermission(ctx.user);

      if (ctx.questionnaire.publishStatus !== AWAITING_APPROVAL) {
        throw new Error("This questionnaire is not awaiting approval.");
      }
      if (input.reviewAction === "Approved") {
        const { questionnaireId } = input;
        const publishDetails = ctx.questionnaire.publishDetails;
        const surveyVersion = ctx.questionnaire.surveyVersion;

        const requestBody = {
          questionnaireId,
          surveyVersion,
          publishDetails,
        };
        // Puts questionnaire into survey register
        await fetch(`${process.env.SURVEY_REGISTER_URL}`, {
          method: "put",
          body: JSON.stringify(requestBody),
          headers: { "Content-Type": "application/json" },
        })
          .then(async (res) => {
            if (res.status === 200) {
              ctx.questionnaire.publishStatus = PUBLISHED;
              await createHistoryEvent(
                ctx.questionnaire.id,
                publishStatusEvent(ctx)
              );
            }
            return res.json();
          })
          .catch((e) => {
            throw Error(e);
          });
      }

      if (input.reviewAction === "Rejected") {
        if (!input.reviewComment) {
          throw new Error("A comment must be provided to reject a survey.");
        }

        ctx.questionnaire.publishStatus = UPDATES_REQUIRED;

        await createHistoryEvent(
          ctx.questionnaire.id,
          publishStatusEvent(ctx, input.reviewComment)
        );
      }

      await saveQuestionnaire(ctx.questionnaire);
      return ctx.questionnaire;
    },
    createComment: async (_, { input }, ctx) => {
      const { componentId, commentText } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = await getCommentsForQuestionnaire(
        questionnaire.id
      );
      const newComment = {
        id: uuidv4(),
        commentText: commentText,
        userId: ctx.user.id,
        createdTime: new Date(),
        replies: [],
        readBy: [ctx.user.id],
      };

      const componentComments = questionnaireComments.comments[componentId];

      if (componentComments) {
        questionnaireComments.comments[componentId].push(newComment);
      } else {
        questionnaireComments.comments[componentId] = [newComment];
      }

      await saveComments(questionnaireComments);
      publishCommentUpdates(questionnaire.id);

      return newComment;
    },
    updateCommentsAsRead: async (_, { input }, ctx) => {
      const { pageId, userId } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = await getCommentsForQuestionnaire(
        questionnaire.id
      );

      const pageComments = questionnaireComments.comments[pageId];

      pageComments.forEach((comment) => {
        if (!comment.readBy) {
          comment.readBy = [];
        }
        if (!comment.readBy.includes(userId)) {
          comment.readBy.push(userId);
        }
        comment.replies.forEach((reply) => {
          if (!reply.readBy) {
            reply.readBy = [];
          }
          if (!reply.readBy.includes(userId)) {
            reply.readBy.push(userId);
          }
        });
      });
      await saveComments(questionnaireComments);

      return pageComments;
    },
    deleteComment: async (_, { input }, ctx) => {
      const { componentId, commentId } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = await getCommentsForQuestionnaire(
        questionnaire.id
      );

      const componentComments = questionnaireComments.comments[componentId];
      if (componentComments) {
        remove(componentComments, ({ id }) => id === commentId);
        await saveComments(questionnaireComments);
      }
      publishCommentUpdates(questionnaire.id);
      return componentComments;
    },
    updateComment: async (_, { input }, ctx) => {
      const { componentId, commentId, commentText } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = await getCommentsForQuestionnaire(
        questionnaire.id
      );
      const pageComments = questionnaireComments.comments[componentId];

      if (!pageComments) {
        throw new Error("No comments found");
      }

      const commentToEdit = pageComments.find(({ id }) => id === commentId);
      commentToEdit.commentText = commentText;
      commentToEdit.editedTime = new Date();
      commentToEdit.readBy = [ctx.user.id];
      await saveComments(questionnaireComments);

      publishCommentUpdates(questionnaire.id);

      return commentToEdit;
    },
    createReply: async (_, { input }, ctx) => {
      const { componentId, commentText, commentId } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = await getCommentsForQuestionnaire(
        questionnaire.id
      );

      const newReply = {
        id: uuidv4(),
        parentCommentId: commentId,
        commentText,
        userId: ctx.user.id,
        createdTime: new Date(),
        readBy: [ctx.user.id],
      };
      let parentComment = questionnaireComments.comments[componentId].find(
        ({ id }) => id === commentId
      );
      if (parentComment) {
        parentComment.replies.push(newReply);
      } else {
        parentComment = [newReply];
      }

      await saveComments(questionnaireComments);

      publishCommentUpdates(questionnaire.id);

      return newReply;
    },
    updateReply: async (_, { input }, ctx) => {
      const { componentId, commentId, replyId, commentText } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = await getCommentsForQuestionnaire(
        questionnaire.id
      );
      const replies = questionnaireComments.comments[componentId].find(
        ({ id }) => id === commentId
      ).replies;

      if (!replies) {
        throw new Error("No replies found!");
      }

      const replyToEdit = replies.find(({ id }) => id === replyId);
      replyToEdit.commentText = commentText;
      replyToEdit.editedTime = new Date();
      replyToEdit.readBy = [ctx.user.id];
      await saveComments(questionnaireComments);

      publishCommentUpdates(questionnaire.id);
      return replyToEdit;
    },
    deleteReply: async (_, { input }, ctx) => {
      const { componentId, commentId, replyId } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = await getCommentsForQuestionnaire(
        questionnaire.id
      );

      const replies = questionnaireComments.comments[componentId].find(
        ({ id }) => id === commentId
      ).replies;

      if (replies) {
        remove(replies, ({ id }) => id === replyId);
        await saveComments(questionnaireComments);
      }
      publishCommentUpdates(questionnaire.id);

      return replies;
    },
    createSkipCondition: createMutation((_, { input }, ctx) => {
      let leftHandSide = {
        type: "Null",
        nullReason: "DefaultSkipCondition",
      };
      const defaultSkipCondition = createExpressionGroup({
        operator: "And",
        expressions: [createExpression({ left: createLeftSide(leftHandSide) })],
      });
      const parent = getSkippableById(ctx, input.parentId);

      parent.skipConditions = parent.skipConditions
        ? [...parent.skipConditions, defaultSkipCondition]
        : [defaultSkipCondition];

      return parent;
    }),
    deleteSkipCondition: createMutation((_, { input }, ctx) => {
      const parent = getSkippables(ctx).find(
        ({ skipConditions }) =>
          skipConditions && skipConditions.find(({ id }) => id === input.id)
      );

      parent.skipConditions.splice(
        parent.skipConditions.findIndex(({ id }) => id === input.id),
        1
      );
      parent.skipConditions = parent.skipConditions.length
        ? parent.skipConditions
        : null;

      return parent;
    }),
    deleteSkipConditions: createMutation((_, { input }, ctx) => {
      const parent = getSkippableById(ctx, input.parentId);
      delete parent.skipConditions;
      return parent;
    }),
    createDisplayCondition: createMutation((_, { input }, ctx) => {
      const { sectionId } = input;

      const section = getSectionById(ctx, sectionId);

      const leftHandSide = {
        type: "Null",
        nullReason: "DefaultDisplayCondition",
      };

      const defaultDisplayCondition = createExpressionGroup({
        operator: "And",
        expressions: [createExpression({ left: createLeftSide(leftHandSide) })],
      });

      section.displayConditions = section.displayConditions
        ? [...section.displayConditions, defaultDisplayCondition]
        : [defaultDisplayCondition];

      return section;
    }),
    deleteDisplayCondition: createMutation((_, { input }, ctx) => {
      const parent = getSections(ctx).find(
        ({ displayConditions }) =>
          displayConditions &&
          displayConditions.find(({ id }) => id === input.id)
      );

      parent.displayConditions.splice(
        parent.displayConditions.findIndex(({ id }) => id === input.id),
        1
      );

      if (parent.displayConditions.length === 0) {
        delete parent.displayConditions;
      }

      return parent;
    }),
    deleteDisplayConditions: createMutation((_, { input }, ctx) => {
      const { sectionId } = input;

      const section = getSectionById(ctx, sectionId);

      delete section.displayConditions;
      return section;
    }),
  },

  Questionnaire: {
    sections: (questionnaire) => questionnaire.sections,
    createdBy: (questionnaire) => getUserById(questionnaire.createdBy),
    questionnaireInfo: (questionnaire) => questionnaire,
    metadata: (questionnaire) => questionnaire.metadata,
    collectionLists: (questionnaire) => questionnaire.collectionLists,
    displayName: (questionnaire) =>
      questionnaire.shortTitle || questionnaire.title,
    editors: (questionnaire) =>
      Promise.all(
        (questionnaire.editors || []).map((editorId) => getUserById(editorId))
      ),
    permission: (questionnaire, args, ctx) => {
      if (hasWritePermission(questionnaire, ctx.user)) {
        return "Write";
      }
      return "Read";
    },
    validationErrorInfo: ({ id }, _, ctx) =>
      returnValidationErrors(ctx, id, ({ type }) => type === "root"),
    totalErrorCount: (questionnaire, args, ctx) => {
      return ctx.validationErrorInfo.length;
    },
    starred: (questionnaire, args, ctx) =>
      Boolean(
        ctx.user.starredQuestionnaires &&
          ctx.user.starredQuestionnaires.find((id) => id === questionnaire.id)
      ),
  },

  History: {
    user: ({ userId }) => getUserById(userId),
  },

  User: {
    displayName: (user) => user.name || user.email,
  },

  Comment: {
    user: ({ userId }) => getUserById(userId),
  },

  Reply: {
    user: ({ userId }) => getUserById(userId),
  },

  QuestionnaireInfo: {
    totalSectionCount: (questionnaire) => questionnaire.sections.length,
  },

  Skippable: {
    __resolveType: ({ pageType, pages }) =>
      pageType ? pageType : pages ? "Folder" : "QuestionConfirmation",
  },

  Routable: {
    __resolveType: ({ pageType }) => pageType,
  },

  List: {
    answers: (list) => list.answers,
    displayName: ({ listName }) => listName || "Untitled list",
    metadata: (_, args, ctx) => {
      return ctx.questionnaire.metadata;
    },
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(ctx, id, ({ listId }) => id === listId),
  },

  QuestionnaireIntroduction: {
    validationErrorInfo: ({ id }, _, ctx) =>
      returnValidationErrors(ctx, id, ({ type }) => type === "introduction"),
  },
  Submission: {
    comments: ({ id }, args, ctx) => ctx.comments[id],
  },

  Section: {
    folders: (section) => section.folders,
    questionnaire: (section, args, ctx) => ctx.questionnaire,
    title: (section) => section.title,
    displayName: (section) => getName(section, "Section"),
    position: ({ id }, args, ctx) => {
      return findIndex(ctx.questionnaire.sections, { id });
    },
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ sectionId, folderId, pageId }) =>
          id === sectionId && !pageId && !folderId
      ),
  },

  Folder: {
    section: ({ id }, args, ctx) => getSectionByFolderId(ctx, id),
    position: ({ id }, args, ctx) => {
      const section = getSectionByFolderId(ctx, id);
      return findIndex(section.folders, { id });
    },
    displayName: ({ alias, title }) => alias || title || "Untitled folder",
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ folderId, pageId }) => id === folderId && !pageId
      ),
  },

  LogicalDestination: {
    id: (destination) => destination.logicalDestination,
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

      const parentPage = find(pages, (page) =>
        some(page.answers, (answer) => answer.id === id)
      );

      return parentPage;
    },
    list: ({ id }, args, ctx) => getListByAnswerId(ctx, id),
    mutuallyExclusiveOption: (answer) =>
      find(answer.options, { mutuallyExclusive: true }),
    validation: (answer) =>
      ["number", "date", "dateRange"].includes(getValidationEntity(answer.type))
        ? answer
        : null,
    displayName: (answer) => getName(answer, "BasicAnswer"),

    // secondaryLabel needed for some answer types e.g. DateRage: label->From field, secodaryLabel->To field.
    // need to define a default for secondaryLabel for use in piping. If label exists then displayName doesn't contain default.
    // If secondaryLabel is set to default, then the default is displayed in answer label instead of leaving it blank
    // Have defined a secondaryLabelDefault field to fallback on if secondaryLabel is empty
    secondaryLabelDefault: (answer) =>
      getName({ label: answer.secondaryLabel }, "BasicAnswer"),
    validationErrorInfo: ({ id }, args, ctx) => {
      const answerErrors = ctx.validationErrorInfo.filter(
        ({ answerId }) => id === answerId
      );

      if (!answerErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: answerErrors,
        totalCount: answerErrors.length,
      };
    },
  },

  MultipleChoiceAnswer: {
    page: (answer, args, ctx) => {
      return getPageByAnswerId(ctx, answer.id);
    },
    list: ({ id }, args, ctx) => getListByAnswerId(ctx, id),
    options: (answer) => answer.options.filter((o) => !o.mutuallyExclusive),
    mutuallyExclusiveOption: (answer) =>
      find(answer.options, { mutuallyExclusive: true }),
    displayName: (answer) => getName(answer, "MultipleChoiceAnswer"),
    validationErrorInfo: ({ id }, args, ctx) => {
      const answerErrors = ctx.validationErrorInfo.filter(
        ({ answerId }) => id === answerId
      );

      return {
        id,
        errors: answerErrors,
        totalCount: answerErrors.length,
      };
    },
  },

  Option: {
    answer: (option, args, ctx) => {
      const answers = getAnswers(ctx);
      return find(answers, (answer) => {
        if (answer.options && some(answer.options, { id: option.id })) {
          return answer;
        }
      });
    },
    displayName: (option) => getName(option, "Option"),
    additionalAnswer: (option) => option.additionalAnswer,
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ optionId, type }) => id === optionId && type === "option"
      ),
  },

  ValidationType: {
    __resolveType: (answer) => {
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
    minValue: (answer) => answer.validation.minValue,
    maxValue: (answer) => answer.validation.maxValue,
  },

  DateValidation: {
    earliestDate: (answer) => answer.validation.earliestDate,
    latestDate: (answer) => answer.validation.latestDate,
  },

  DateRangeValidation: {
    earliestDate: (answer) => answer.validation.earliestDate,
    latestDate: (answer) => answer.validation.latestDate,
    minDuration: (answer) => answer.validation.minDuration,
    maxDuration: (answer) => answer.validation.maxDuration,
  },

  MinValueValidationRule: {
    enabled: ({ enabled }) => enabled,
    inclusive: ({ inclusive }) => inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ validationId }) => id === validationId
      ),
  },

  MaxValueValidationRule: {
    enabled: ({ enabled }) => enabled,
    inclusive: ({ inclusive }) => inclusive,
    custom: ({ custom }) => custom,
    entityType: ({ entityType }) => entityType,
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
    validationErrorInfo: ({ id }, args, ctx) => {
      const maxValueErrors = ({ validationId }) => id === validationId;
      return returnValidationErrors(ctx, id, maxValueErrors);
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
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ validationId }) => id === validationId
      ),
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const latestDateErrors = ({ validationId }) => id === validationId;
      return returnValidationErrors(ctx, id, latestDateErrors);
    },
  },

  MinDurationValidationRule: {
    duration: ({ duration }) => duration,
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ validationId }) => id === validationId
      ),
  },

  MaxDurationValidationRule: {
    duration: ({ duration }) => duration,
    validationErrorInfo: ({ id }, args, ctx) => {
      const maxDurationErrors = ({ validationId }) => id === validationId;
      return returnValidationErrors(ctx, id, maxDurationErrors);
    },
  },

  TotalValidationRule: {
    previousAnswer: ({ previousAnswer }, args, ctx) =>
      isNil(previousAnswer) ? null : getAnswerById(ctx, previousAnswer),
  },

  Metadata: {
    dateValue: ({ type, dateValue }) => {
      if (type !== "Date" || !dateValue) {
        return null;
      }
      return new Date(dateValue);
    },
    displayName: (metadata) => getName(metadata, "Metadata"),
  },

  QuestionConfirmation: {
    displayName: (confirmation) =>
      getName(confirmation, "QuestionConfirmation"),
    page: ({ pageId }, args, ctx) => getPageById(ctx, pageId),
    validationErrorInfo: ({ id }, args, ctx) => {
      const confirmationQuestionErrors = ctx.validationErrorInfo.filter(
        ({ confirmationId }) => id === confirmationId
      );
      return {
        id,
        errors: confirmationQuestionErrors,
        totalCount: confirmationQuestionErrors.length,
      };
    },
  },

  ConfirmationOption: {
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ confirmationOptionId }) => id === confirmationOptionId
      ),
  },

  ThemeSettings: {
    validationErrorInfo: ({ id }, _args, ctx) =>
      returnValidationErrors(ctx, id, ({ type }) =>
        ["theme", "themeSettings"].includes(type)
      ),
    themes: ({ themes: savedThemes }, _args, ctx) => {
      // Return all themes as disabled by default
      // If present in questionnaire, override with actual attributes
      return ctx.questionnaire.type === SOCIAL
        ? savedThemes
        : THEME_SHORT_NAMES.map((shortName) => ({
            shortName,
            id: shortName,
            enabled: false,
            legalBasisCode: "NOTICE_1",
            ...(getThemeByShortName(ctx, shortName) ?? {}),
          }));
    },
  },

  Theme: {
    validationErrorInfo: ({ id }, _args, ctx) =>
      returnValidationErrors(ctx, id, ({ themeId }) => themeId === id),
    themeSettings: (_root, _args, ctx) => ctx.questionnaire.themeSettings,
  },

  Date: GraphQLDate,
  DateTime: GraphQLDateTime,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
