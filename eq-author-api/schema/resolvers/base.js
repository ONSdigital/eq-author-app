const { GraphQLDate, GraphQLDateTime } = require("graphql-iso-date");
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
const { logger } = require("../../utils/logger");

const {
  UNPUBLISHED,
  PUBLISHED,
  AWAITING_APPROVAL,
  UPDATES_REQUIRED,
} = require("../../constants/publishStatus");

const { DURATION_LOOKUP } = require("../../constants/durationTypes");
const {
  DATE,
  CHECKBOX,
  RADIO,
  MUTUALLY_EXCLUSIVE,
  SELECT,
} = require("../../constants/answerTypes");

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
  createList,
} = require("../../src/businessLogic");

const {
  getExpressions,
  getSections,
  getPagesFromSection,
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
  getListById,
  getListByAnswerId,
  getAnswerByOptionId,
  setDataVersion,
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
const onListDeleted = require("../../src/businessLogic/onListDeleted");
const onSectionUpdated = require("../../src/businessLogic/onSectionUpdated");

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
  updateUser,
} = require("../../db/datastore");

const {
  createDefaultBusinessSurveyMetadata,
} = require("../../utils/defaultMetadata");

const { listQuestionnaires } = require("../../db/datastore");

const createQuestionnaireIntroduction = require("../../utils/createQuestionnaireIntroduction");
const createSubmission = require("../../utils/createSubmission");

const createTotalValidation = require("../../src/businessLogic/createTotalValidation");

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

const deleteFirstPageSkipConditions = require("../../src/businessLogic/deleteFirstPageSkipConditions");
const deleteLastPageRouting = require("../../src/businessLogic/deleteLastPageRouting");

const createNewQuestionnaire = (input) => {
  const defaultQuestionnaire = {
    id: uuidv4(),
    theme: "business",
    legalBasis: "NOTICE_1",
    surveyId: "",
    formType: "",
    eqId: "",
    qcodes: true,
    navigation: false,
    hub: false,
    dataVersion: "1",
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
    locked: false,
    submission: createSubmission(),
  };

  let changes = {};
  const metadata = createDefaultBusinessSurveyMetadata();
  changes = {
    metadata,
    introduction: createQuestionnaireIntroduction(metadata),
  };

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
      await updateUser(ctx.user);

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
      const comments = ctx.comments;

      if (comments[id]) {
        return comments[id];
      }
      return [];
    },
    skippable: (root, { input: { id } }, ctx) => getSkippableById(ctx, id),
    submission: (root, _, ctx) => ctx.questionnaire.submission,
    introduction: (root, _, ctx) => ctx.questionnaire.introduction,
    collectionLists: (_, args, ctx) => ctx.questionnaire.collectionLists,
    publishHistory: (_, args, ctx) => ctx.questionnaire.publishHistory,
    list: (root, { input: { listId } }, ctx) =>
      find(ctx.questionnaire.collectionLists.lists, { id: listId }),
    prepopSchemaVersions: async (_, args) => {
      const { id } = args;
      const url = `${process.env.PREPOP_SCHEMA_GATEWAY}schemaVersionsGet?survey_id=${id}`;

      try {
        const response = await fetch(url);
        const prepopSchema = await response.json();
        return prepopSchema;
      } catch (err) {
        throw Error(err);
      }
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
      logger.info(`Questionnaire Created with ID ${ctx.questionnaire.id}`);

      return ctx.questionnaire;
    },
    updateQuestionnaire: createMutation((_, { input }, ctx) => {
      Object.assign(ctx.questionnaire, input);
      onQuestionnaireUpdated(ctx.questionnaire);
      logger.info(
        `Questionnaire Updated with the ID - ${ctx.questionnaire.id}`
      );

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
      logger.info(
        { qid: ctx.questionnaire.id },
        `Deleted Questionnaire with ID ${input.id}`
      );

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
        publishHistory: [],
        surveyVersion: 1,
        locked: false,
      };

      logger.info(
        { qid: questionnaire.id },
        `Duplicated questionnire with title - ${questionnaire.title}`
      );

      return createQuestionnaire(newQuestionnaire, ctx);
    },
    updateSurveyId: createMutation((root, { input: { surveyId } }, ctx) => {
      ctx.questionnaire.surveyId = surveyId;
      logger.info(
        { qid: ctx.questionnaire.id },
        `Updated survery with ID ${surveyId}`
      );
      return ctx.questionnaire;
    }),
    updateQuestionnaireIntroduction: createMutation((root, { input }, ctx) => {
      ctx.questionnaire.introduction = {
        ...ctx.questionnaire.introduction,
        ...input,
      };

      return ctx.questionnaire.introduction;
    }),
    updateSubmission: createMutation((root, { input }, ctx) => {
      ctx.questionnaire.submission = {
        ...ctx.questionnaire.submission,
        ...input,
      };

      return ctx.questionnaire.submission;
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
    createIntroductionPage: createMutation((root, args, ctx) => {
      const questionnaire = ctx.questionnaire;
      const metadata = questionnaire.metadata;
      const introduction = createQuestionnaireIntroduction(metadata);
      ctx.questionnaire.introduction = introduction;

      logger.info(
        { qid: ctx.questionnaire.id },
        `New Introduction created with ID ${introduction.id}`
      );

      return introduction;
    }),
    deleteIntroductionPage: createMutation((root, args, ctx) => {
      const questionnaire = ctx.questionnaire;
      const introduction = questionnaire.introduction;

      logger.info(
        { qid: ctx.questionnaire.id },
        `Removed introduction with ID: ${introduction.id} from questionnaire: ${ctx.questionnaire.id}`
      );

      questionnaire.introduction = undefined;

      return questionnaire;
    }),
    createSection: createMutation((root, { input }, ctx) => {
      const section = createSection(input);
      ctx.questionnaire.sections.push(section);
      ctx.questionnaire.hub = ctx.questionnaire.sections.length > 1;
      logger.info(
        { qid: ctx.questionnaire.id },
        "New Section Created and Hub Turned On"
      );
      return section;
    }),
    updateSection: createMutation((_, { input }, ctx) => {
      const section = getSectionById(ctx, input.id);
      const oldSection = { ...section };
      merge(section, input);
      onSectionUpdated(ctx, section, oldSection);
      logger.info(
        { qid: ctx.questionnaire.id },
        `Section Updated with ID - ${input.id}`
      );
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
      ctx.questionnaire.hub = ctx.questionnaire.sections.length > 1;
      logger.info(
        { qid: ctx.questionnaire.id },
        `Removed Section with ID - ${input.id}`
      );

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
      set(
        newSection,
        "introductionPageDescription",
        addPrefix(newSection.introductionPageDescription)
      );
      set(
        newSection,
        "sectionSummaryPageDescription",
        addPrefix(newSection.sectionSummaryPageDescription)
      );
      const duplicatedSection = createSection(newSection);
      const remappedSection = remapAllNestedIds(duplicatedSection);
      ctx.questionnaire.sections.splice(input.position, 0, remappedSection);
      ctx.questionnaire.hub = ctx.questionnaire.sections.length > 1;
      logger.info(
        { qid: ctx.questionnaire.id },
        `Section Duplicated from Section with ID ${input.id}. New Section ID is ${duplicatedSection.id}`
      );
      return remappedSection;
    }),
    createFolder: createMutation(
      (
        root,
        { input: { isCalcSum, isListCollector, position, ...params } },
        ctx
      ) => {
        const folder = createFolder(params, isCalcSum, isListCollector);
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
          logger.info(
            { qid: ctx.questionnaire.id },
            `Folder with ID ${folderToMove.id} moved to section with ID ${newSection.id} at position ${position} from ${section.id}`
          );
        } else {
          logger.info(
            { qid: ctx.questionnaire.id },
            `Folder with ID ${folderToMove.id} moved to position ${position}`
          );
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
      logger.info(
        { qid: ctx.questionnaire.id },
        `Duplicated Folder with ID ${folder.id}. New, Duplicated Folder with ID ${duplicatedFolder.id}`
      );

      return remappedFolder;
    }),
    createAnswer: createMutation((root, { input }, ctx) => {
      const page = getPageById(ctx, input.questionPageId);
      const answer = createAnswer(input, page);
      const lastAnswer = page.answers[page.answers.length - 1];

      if (lastAnswer && lastAnswer.type === MUTUALLY_EXCLUSIVE) {
        page.answers.splice(page.answers.length - 1, 0, answer);
      } else {
        page.answers.push(answer);
      }

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
      merge(answer, input);

      if (answer.type === DATE && !input.label && input?.properties?.format) {
        answer.validation.earliestDate.offset.unit =
          DURATION_LOOKUP[input.properties.format];
        answer.validation.latestDate.offset.unit =
          DURATION_LOOKUP[input.properties.format];
      }

      const pages = getPages(ctx);
      onAnswerUpdated(input, pages);

      const page = getPageByAnswerId(ctx, answer.id);
      if (answer.repeatingLabelAndInput && !page.totalValidation) {
        page.totalValidation = createTotalValidation();
      }

      if (!answer.repeatingLabelAndInput && page) {
        delete page.totalValidation;
      }

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
      const answer = getAnswerByOptionId(ctx, input.id);
      if (input.dynamicAnswer === false && answer.options.length === 1) {
        answer.options.push(createOption());
      }
      merge(option, input);
      setDataVersion(ctx);
      return option;
    }),
    deleteOption: createMutation((_, { input }, ctx) => {
      const answers = getAnswers(ctx);

      const answer = find(answers, (answer) => {
        if (answer.options && some(answer.options, { id: input.id })) {
          return answer;
        }
      });

      answers.forEach((tempAnswer) => {
        if (
          tempAnswer.options &&
          answer.options.length === 2 &&
          tempAnswer.options.some(
            ({ dynamicAnswerID }) => answer.id === dynamicAnswerID
          )
        ) {
          tempAnswer.options.forEach((option) => {
            if (option.dynamicAnswer) {
              option.dynamicAnswerID = null;
              return option;
            }
          });
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

      if (
        ![CHECKBOX, RADIO, MUTUALLY_EXCLUSIVE, SELECT].includes(answer.type)
      ) {
        delete answer.options;
      }
      setDataVersion(ctx);
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
        pageDescription: "",
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
      (
        _,
        { input: { positive, negative, id, title, pageDescription, qCode } },
        ctx
      ) => {
        const newValues = {
          title,
          pageDescription,
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

      logger.info(
        { qid: ctx.questionnaire.id },
        `List created with - ${JSON.stringify(list)}`
      );
      ctx.questionnaire.collectionLists.lists.push(list);
      setDataVersion(ctx);
      return ctx.questionnaire.collectionLists;
    }),
    updateList: createMutation(async (root, { input }, ctx) => {
      const list = getListById(ctx, input.id);
      list.listName = input.listName;
      logger.info(
        { qid: ctx.questionnaire.id },
        `List created with - ${input.listName}`
      );

      return list;
    }),
    deleteList: createMutation(async (root, { input }, ctx) => {
      const removedList = first(
        remove(ctx.questionnaire.collectionLists.lists, { id: input.id })
      );
      onListDeleted(ctx, removedList);
      logger.info(
        { qid: ctx.questionnaire.id },
        `List removed with ID - ${input.id}`
      );
      ctx.questionnaire.dataVersion =
        ctx.questionnaire.collectionLists.lists.length > 0 ? "3" : "1";

      const answers = getAnswers(ctx);

      answers.forEach((answer) => {
        if (answer.repeatingLabelAndInputListId === input.id) {
          answer.repeatingLabelAndInputListId = "";
        }
      });

      return ctx.questionnaire.collectionLists;
    }),
    createListAnswer: createMutation((root, { input }, ctx) => {
      const list = find(ctx.questionnaire.collectionLists.lists, {
        id: input.listId,
      });
      const answer = createAnswer(omit(input, "listId"), list);
      list.answers.push(answer);

      onAnswerCreated(list, answer);
      logger.info(
        { qid: ctx.questionnaire.id },
        `List Answer Created with ID - ${answer.id}`
      );

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
        Business: "business",
        Social: "social",
        Health: "health",
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

      const questionnaireComments = ctx.comments;
      const componentComments = questionnaireComments[componentId];

      const newComment = {
        id: uuidv4(),
        commentText: commentText,
        userId: ctx.user.id,
        createdTime: new Date(),
        replies: [],
        readBy: [ctx.user.id],
      };

      if (componentComments) {
        componentComments.push(newComment);
      } else {
        questionnaireComments[componentId] = [newComment];
      }

      await saveComments({
        questionnaireId: ctx.questionnaire.id,
        comments: questionnaireComments,
      });
      publishCommentUpdates(questionnaire.id);
      logger.info(
        { qid: ctx.questionnaire.id },
        `Comment created ${JSON.stringify(newComment)} `
      );

      return newComment;
    },
    updateCommentsAsRead: async (_, { input }, ctx) => {
      /*  updateCommentAsRead must run after getPage - getPage returns one readBy user, updateCommentAsRead returns two
          If getPage runs after updateCommentAsRead, the readBy data is overwritten and only one user is returned
          This causes the notification to be displayed when the user has read the comment
      */
      const sleep = (ms) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };

      await sleep(10);

      const { pageId, userId } = input;

      const questionnaireComments = ctx.comments;

      const pageComments =
        questionnaireComments && questionnaireComments[pageId];

      pageComments?.forEach((comment) => {
        if (!comment.readBy.includes(userId)) {
          comment.readBy.push(userId);
        }
        comment?.replies?.forEach((reply) => {
          if (!reply.readBy.includes(userId)) {
            reply.readBy.push(userId);
          }
        });
      });
      await saveComments({
        questionnaireId: ctx?.questionnaire?.id,
        comments: questionnaireComments,
      });

      return pageComments;
    },
    deleteComment: async (_, { input }, ctx) => {
      const { componentId, commentId } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = ctx.comments;
      const componentComments = questionnaireComments[componentId];

      if (componentComments) {
        remove(componentComments, ({ id }) => id === commentId);
        await saveComments({
          questionnaireId: ctx.questionnaire.id,
          comments: questionnaireComments,
        });
      }
      publishCommentUpdates(questionnaire.id);
      logger.info(
        { qid: ctx.questionnaire.id },
        `Comment deleted with ID ${commentId} `
      );

      return componentComments;
    },
    updateComment: async (_, { input }, ctx) => {
      const { componentId, commentId, commentText } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = ctx.comments;
      const componentComments = questionnaireComments[componentId];

      if (!componentComments) {
        throw new Error("No comments found");
      }

      const commentToEdit = componentComments.find(
        ({ id }) => id === commentId
      );
      commentToEdit.commentText = commentText;
      commentToEdit.editedTime = new Date();
      commentToEdit.readBy = [ctx.user.id];
      await saveComments({
        questionnaireId: ctx.questionnaire.id,
        comments: questionnaireComments,
      });

      logger.info(
        { qid: ctx.questionnaire.id },
        `Updated comment text with ${commentText} by ${ctx.user.id}`
      );

      publishCommentUpdates(questionnaire.id);

      return commentToEdit;
    },
    createReply: async (_, { input }, ctx) => {
      const { componentId, commentText, commentId } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = ctx.comments;

      const newReply = {
        id: uuidv4(),
        parentCommentId: commentId,
        commentText,
        userId: ctx.user.id,
        createdTime: new Date(),
        readBy: [ctx.user.id],
      };

      let parentComment = questionnaireComments[componentId].find(
        ({ id }) => id === commentId
      );

      if (parentComment) {
        parentComment.replies.push(newReply);
      } else {
        parentComment = [newReply];
      }

      await saveComments({
        questionnaireId: ctx.questionnaire.id,
        comments: questionnaireComments,
      });

      logger.info(
        { qid: ctx.questionnaire.id },
        `Reply comment text with ${JSON.stringify(
          newReply
        )} on parent comment ${JSON.stringify(parentComment)}`
      );

      publishCommentUpdates(questionnaire.id);

      return newReply;
    },
    updateReply: async (_, { input }, ctx) => {
      const { componentId, commentId, replyId, commentText } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = ctx.comments;
      const replies = questionnaireComments[componentId].find(
        ({ id }) => id === commentId
      ).replies;

      if (!replies) {
        throw new Error("No replies found!");
      }

      const replyToEdit = replies.find(({ id }) => id === replyId);
      replyToEdit.commentText = commentText;
      replyToEdit.editedTime = new Date();
      replyToEdit.readBy = [ctx.user.id];
      await saveComments({
        questionnaireId: ctx.questionnaire.id,
        comments: questionnaireComments,
      });

      logger.info(
        { qid: ctx.questionnaire.id },
        `Reply updated with ${commentText} created by user with ID ${ctx.user.id}`
      );

      publishCommentUpdates(questionnaire.id);
      return replyToEdit;
    },
    deleteReply: async (_, { input }, ctx) => {
      const { componentId, commentId, replyId } = input;
      const questionnaire = ctx.questionnaire;

      const questionnaireComments = ctx.comments;

      const replies = questionnaireComments[componentId].find(
        ({ id }) => id === commentId
      ).replies;

      if (replies) {
        remove(replies, ({ id }) => id === replyId);
        await saveComments({
          questionnaireId: ctx.questionnaire.id,
          comments: questionnaireComments,
        });
      }
      publishCommentUpdates(questionnaire.id);
      logger.info(
        { qid: ctx.questionnaire.id },
        `Reply deleted with ID ${replyId} from parent comment ${commentId}`
      );

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
    publishSchema: createMutation(async (root, args, ctx) => {
      const publishDate = new Date();
      const publishResult = {
        id: uuidv4(),
        surveyId: ctx.questionnaire.surveyId,
        formType: ctx.questionnaire.formType,
        publishDate,
      };

      if (ctx.questionnaire.publishHistory) {
        ctx.questionnaire.publishHistory.push(publishResult);
      } else {
        ctx.questionnaire.publishHistory = [publishResult];
      }

      const convertedResponse = await fetch(`${process.env.CONVERSION_URL}`, {
        method: "post",
        body: JSON.stringify(ctx.questionnaire),
        headers: { "Content-Type": "application/json" },
      }).catch((e) => {
        publishResult.success = false;
        publishResult.errorMessage = `Failed to fetch questionnaire - ${e.message}`;
      });

      if (publishResult.success === false) {
        return ctx.questionnaire;
      }

      if (convertedResponse.status !== 200) {
        publishResult.success = false;
        publishResult.errorMessage = `Publisher failed to convert questionnaire - ${convertedResponse.statusText}`;
        return ctx.questionnaire;
      }

      const convertedQuestionnaire = await convertedResponse.json();

      await fetch(`${process.env.CIR_PUBLISH_SCHEMA_GATEWAY}publishSchema`, {
        method: "post",
        body: JSON.stringify(convertedQuestionnaire),
        headers: { "Content-Type": "application/json" },
      })
        .then(async (res) => {
          if (res.status === 200) {
            const responseJson = await res.json();

            publishResult.cirId = responseJson.id;
            publishResult.cirVersion = responseJson.version;
            publishResult.success = true;
          } else {
            publishResult.success = false;
            publishResult.errorMessage = `Invalid response - failed with error code ${res.status}`;
          }
        })
        .catch((e) => {
          publishResult.success = false;
          publishResult.errorMessage = `Failed to publish questionnaire - ${e.message}`;
        });

      return ctx.questionnaire;
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
      pageType ? pageType : pages ? "BasicFolder" : "QuestionConfirmation",
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
    questionnaire: (root, args, ctx) => ctx.questionnaire,
    validationErrorInfo: ({ id }, _, ctx) =>
      returnValidationErrors(ctx, id, ({ type }) => type === "introduction"),
    comments: ({ id }, args, ctx) => ctx.comments[id],
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
    comments: ({ id }, args, ctx) => ctx.comments[id],
    allowRepeatingSection: (section) =>
      findIndex(getPagesFromSection(section), {
        pageType: "ListCollectorPage",
      }) < 0,
  },

  CollectionLists: {
    questionnaire: (collectionLists, args, ctx) => ctx.questionnaire,
  },

  Folder: {
    __resolveType: () => "BasicFolder",
  },

  BasicFolder: {
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
      if (
        includes(["Checkbox", "Radio", "MutuallyExclusive", "Select"], type)
      ) {
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
      const answerErrors = ctx.validationErrorInfo
        .filter(({ answerId }) => id === answerId)
        .reverse();

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
    __resolveType: "Metadata",
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
    comments: ({ id }, args, ctx) => ctx.comments[id],
  },

  ConfirmationOption: {
    validationErrorInfo: ({ id }, args, ctx) =>
      returnValidationErrors(
        ctx,
        id,
        ({ confirmationOptionId }) => id === confirmationOptionId
      ),
  },

  Date: GraphQLDate,
  DateTime: GraphQLDateTime,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
