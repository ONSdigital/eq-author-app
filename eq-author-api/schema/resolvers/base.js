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
const { v4: uuidv4 } = require("uuid");
const { withFilter } = require("apollo-server-express");
const fetch = require("node-fetch");

const {
  UNPUBLISHED,
  PUBLISHED,
  AWAITING_APPROVAL,
  UPDATES_REQUIRED,
} = require("../../constants/publishStatus");

const { DURATION_LOOKUP } = require("../../constants/durationTypes");
const { ROUTING_ANSWER_TYPES } = require("../../constants/routingAnswerTypes");
const { DATE } = require("../../constants/answerTypes");

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
} = require("../../src/businessLogic");

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
  getSkippables,
  getSkippableById,
  remapAllNestedIds,
} = require("./utils");

const createAnswer = require("../../src/businessLogic/createAnswer");
const onAnswerCreated = require("../../src/businessLogic/onAnswerCreated");
const onAnswerDeleted = require("../../src/businessLogic/onAnswerDeleted");
const updateMetadata = require("../../src/businessLogic/updateMetadata");
const getPreviousAnswersForPage = require("../../src/businessLogic/getPreviousAnswersForPage");
const getPreviousAnswersForSection = require("../../src/businessLogic/getPreviousAnswersForSection");
const createOption = require("../../src/businessLogic/createOption");
const onSectionDeleted = require("../../src/businessLogic/onSectionDeleted");
const addPrefix = require("../../utils/addPrefix");
const { createQuestionPage } = require("./pages/questionPage");

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
} = require("../../db/datastore");

const {
  createDefaultBusinessSurveyMetadata,
} = require("../../utils/defaultMetadata");

const { listQuestionnaires } = require("../../db/datastore");

const createQuestionnaireIntroduction = require("../../utils/createQuestionnaireIntroduction");

const {
  enforceHasWritePermission,
  hasWritePermission,
  enforceHasAdminPermission,
} = require("./withPermissions");
const { createMutation } = require("./createMutation");

const {
  noteCreationEvent,
  publishStatusEvent,
} = require("../../utils/questionnaireEvents");

const deleteFirstPageSkipConditions = require("../../src/businessLogic/deleteFirstPageSkipConditions");
const deleteLastPageRouting = require("../../src/businessLogic/deleteLastPageRouting");

const createSection = (input = {}) => ({
  id: uuidv4(),
  title: "",
  introductionEnabled: false,
  pages: [createQuestionPage()],
  alias: "",
  ...input,
});

const createNewQuestionnaire = input => {
  const defaultQuestionnaire = {
    id: uuidv4(),
    theme: "default",
    legalBasis: "Voluntary",
    navigation: false,
    createdAt: new Date(),
    metadata: [],
    sections: [createSection()],
    summary: false,
    version: currentVersion,
    surveyVersion: 1,
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

const publishCommentUpdates = componentId => {
  pubsub.publish("commentsUpdated", {
    componentId,
  });
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
    history: async (root, { input }) =>
      getQuestionnaireMetaById(input.questionnaireId).then(
        ({ history }) => history
      ),
    section: (root, { input }, ctx) => getSectionById(ctx, input.sectionId),
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
      const { comments } = await getCommentsForQuestionnaire(
        questionnaireId
      );
      let sortedComments = comments[id] || [];
      sortedComments.sort(
        (a, b) => b.createdTime - a.createdTime
      );
      return sortedComments;
    },
    getAvailableAnswers: (root, { input }, ctx) =>
      getPreviousAnswersForPage(
        ctx.questionnaire,
        input.pageId,
        input.includeSelf,
        ROUTING_ANSWER_TYPES
      ),
    skippable: (root, { input: { id } }, ctx) => getSkippableById(ctx, id),
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
    commentsUpdated: {
      resolve: ({ componentId }) => {
        return { id: componentId };
      },
      subscribe: withFilter(
        () => pubsub.asyncIterator(["commentsUpdated"]),
        (payload, variables) => {
          return payload.componentId === variables.id;
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
        id: uuidv4(),
        createdBy: ctx.user.id,
        createdAt: new Date(),
        editors: [],
        publishStatus: UNPUBLISHED,
        surveyVersion: 1,
      };
      return createQuestionnaire(newQuestionnaire, ctx);
    },
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
      const noteToDelete = history.find(item => item.id === input.id);

      if (!user.admin && user.id !== noteToDelete.userId) {
        throw new Error("User doesnt have access");
      }
      if (noteToDelete.type === "system") {
        throw new Error("Cannot delete system event message");
      }

      remove(metadata.history, item => item.id === noteToDelete.id);

      await saveMetadata(metadata);
      return metadata.history;
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
      const removedSection = first(remove(ctx.questionnaire.sections, section));
      onSectionDeleted(ctx, removedSection);
      deleteFirstPageSkipConditions(ctx);
      deleteLastPageRouting(ctx);
      return ctx.questionnaire;
    }),
    moveSection: createMutation((_, { input }, ctx) => {
      const removedSection = first(
        remove(ctx.questionnaire.sections, { id: input.id })
      );
      ctx.questionnaire.sections.splice(input.position, 0, removedSection);
      deleteFirstPageSkipConditions(ctx);
      deleteLastPageRouting(ctx);
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

      if (answer.type === DATE && !input.label && input.properties.format) {
        answer.validation.earliestDate.offset.unit =
          DURATION_LOOKUP[input.properties.format];
        answer.validation.latestDate.offset.unit =
          DURATION_LOOKUP[input.properties.format];
      }
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

      onAnswerDeleted(ctx, page, deletedAnswer);

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
        if (!page.routing && !page.skipConditions) {
          return;
        }

        const routingExprs = page.routing
          ? page.routing.rules.flatMap(
              rule => rule.expressionGroup && rule.expressionGroup.expressions
            )
          : [];
        const skipExprs = page.skipConditions
          ? page.skipConditions.flatMap(
              condition => condition && condition.expressions
            )
          : [];
        const rightHandSides = [...routingExprs, ...skipExprs].map(
          x => x && x.right
        );

        rightHandSides.forEach(right => {
          if (right && right.optionIds) {
            remove(right.optionIds, value => value === removedOption.id);
          }
        });
      });

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

      const newValidation = Object.assign({}, validation);

      delete validation.validationType;

      return newValidation;
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
      const deletedMetadata = first(
        remove(ctx.questionnaire.metadata, {
          id: input.id,
        })
      );

      ctx.questionnaire.metadata.forEach(row => {
        if (row.fallbackKey === deletedMetadata.key) {
          row.fallbackKey = null;
        }
      });

      return deletedMetadata;
    }),
    createQuestionConfirmation: createMutation((_, { input }, ctx) => {
      const section = getSectionByPageId(ctx, input.pageId);
      const page = find(section.pages, { id: input.pageId });
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
          .then(async res => {
            if (res.status === 200) {
              ctx.questionnaire.publishStatus = PUBLISHED;
              await createHistoryEvent(
                ctx.questionnaire.id,
                publishStatusEvent(ctx)
              );
            }
            return res.json();
          })
          .catch(e => {
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
      };

      const componentComments = questionnaireComments.comments[componentId];

      if (componentComments) {
        questionnaireComments.comments[componentId].push(newComment);
      } else {
        questionnaireComments.comments[componentId] = [newComment];
      }

      await saveComments(questionnaireComments);
      publishCommentUpdates(componentId);

      return newComment;
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
      publishCommentUpdates(componentId);
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
      await saveComments(questionnaireComments);

      publishCommentUpdates(componentId);

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

      publishCommentUpdates(componentId);

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
      await saveComments(questionnaireComments);

      publishCommentUpdates(componentId);
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
      publishCommentUpdates(componentId);

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
    totalErrorCount: (questionnaire, args, ctx) => {
      //remove qcode errors from total here - important as Qcode errors don't count to total
      // otherwise error totals get confusing for users!!!!!!
      const validationErrorsQCode = ctx.validationErrorInfo.filter(
        ({ field }) => field === "qCode" || field === "secondaryQCode"
      );
      return ctx.validationErrorInfo.length - validationErrorsQCode.length;
    },
    qCodeErrorCount: (questionnaire, args, ctx) => {
      const validationErrorsQCode = ctx.validationErrorInfo.filter(
        ({ field }) => field === "qCode" || field === "secondaryQCode"
      );
      return validationErrorsQCode.length;
    },
  },

  History: {
    user: ({ userId }) => getUserById(userId),
  },

  User: {
    displayName: user => user.name || user.email,
  },

  Comment: {
    user: ({ userId }) => getUserById(userId),
  },

  Reply: {
    user: ({ userId }) => getUserById(userId),
  },

  QuestionnaireInfo: {
    totalSectionCount: questionnaire => questionnaire.sections.length,
  },

  Skippable: {
    __resolveType: ({ pageType }) =>
      pageType === "QuestionPage" ? "QuestionPage" : "QuestionConfirmation",
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const sectionErrors = ctx.validationErrorInfo.filter(
        ({ sectionId, pageId }) => id === sectionId && !pageId
      );

      if (!sectionErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: sectionErrors,
        totalCount: sectionErrors.length,
      };
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

    validationErrorInfo: ({ id }, args, ctx) => {
      const answerErrors = ctx.validationErrorInfo.filter(
        ({ answerId }) => id === answerId
      );

      const answerErrorsQCode = answerErrors.filter(
        ({ field }) => field === "qCode" || field === "secondaryQCode"
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
        totalCount: answerErrors.length - answerErrorsQCode.length,
      };
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const answerErrors = ctx.validationErrorInfo.filter(
        ({ answerId }) => id === answerId
      );

      const qCodeErrorCount = answerErrors.filter(
        ({ field }) => field === "qCode"
      ).length;

      return {
        id,
        errors: answerErrors,
        totalCount: answerErrors.length - qCodeErrorCount,
      };
    },
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const optionErrors = ctx.validationErrorInfo.filter(
        ({ optionId }) => id === optionId
      );

      if (!optionErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }
      return {
        id,
        errors: optionErrors,
        totalCount: optionErrors.length,
      };
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const minValueErrors = ctx.validationErrorInfo.filter(
        ({ validationId }) => id === validationId
      );

      if (!minValueErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: minValueErrors,
        totalCount: minValueErrors.length,
      };
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const maxValueErrors = ctx.validationErrorInfo.filter(
        ({ validationId }) => id === validationId
      );

      const sharedErrors = ctx.validationErrorInfo.filter(
        ({ validationProperty, errorCode, answerId }) => {
          const answer = getAnswerById(ctx, answerId);
          if (answer && answer.validation && answer.validation.maxValue) {
            const errorsShareParent = answer.validation.maxValue.id === id;
            return (
              validationProperty === "minValue" &&
              errorsShareParent &&
              errorCode === "ERR_MIN_LARGER_THAN_MAX"
            );
          }
          return false;
        }
      );

      if (!maxValueErrors && !sharedErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: [...maxValueErrors, ...sharedErrors],
        totalCount: maxValueErrors.length + sharedErrors.length,
      };
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const earliestDateErrors = ctx.validationErrorInfo.filter(
        ({ validationId }) => id === validationId
      );

      if (!earliestDateErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: earliestDateErrors,
        totalCount: earliestDateErrors.length,
      };
    },
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const latestDateErrors = ctx.validationErrorInfo.filter(
        ({ validationId }) => id === validationId
      );

      const sharedErrors = ctx.validationErrorInfo.filter(
        ({ validationProperty, errorCode, answerId }) => {
          const answer = getAnswerById(ctx, answerId);
          if (answer && answer.validation && answer.validation.latestDate) {
            const errorsShareParent = answer.validation.latestDate.id === id;
            return (
              validationProperty === "earliestDate" &&
              errorsShareParent &&
              errorCode === "ERR_EARLIEST_AFTER_LATEST"
            );
          }
          return false;
        }
      );

      if (!latestDateErrors && !sharedErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: [...latestDateErrors, ...sharedErrors],
        totalCount: latestDateErrors.length + sharedErrors.length,
      };
    },
  },
  MinDurationValidationRule: {
    duration: ({ duration }) => duration,
    validationErrorInfo: ({ id }, args, ctx) => {
      const minDurationErrors = ctx.validationErrorInfo.filter(
        ({ validationId }) => id === validationId
      );

      if (!minDurationErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: minDurationErrors,
        totalCount: minDurationErrors.length,
      };
    },
  },

  MaxDurationValidationRule: {
    duration: ({ duration }) => duration,
    validationErrorInfo: ({ id }, args, ctx) => {
      const maxDurationErrors = ctx.validationErrorInfo.filter(
        ({ validationId }) => id === validationId
      );

      const sharedErrors = ctx.validationErrorInfo.filter(
        ({ validationProperty, errorCode, answerId }) => {
          const answer = getAnswerById(ctx, answerId);
          if (answer && answer.validation && answer.validation.maxDuration) {
            const errorsShareParent = answer.validation.maxDuration.id === id;
            return (
              validationProperty === "minDuration" &&
              errorsShareParent &&
              errorCode === "ERR_MAX_DURATION_TOO_SMALL"
            );
          }
          return false;
        }
      );

      if (!maxDurationErrors && !sharedErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: [...maxDurationErrors, ...sharedErrors],
        totalCount: maxDurationErrors.length + sharedErrors.length,
      };
    },
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
    validationErrorInfo: ({ id }, args, ctx) => {
      const confirmationQuestionErrors = ctx.validationErrorInfo.filter(
        ({ confirmationId }) => id === confirmationId
      );

      const qCodeErrors = confirmationQuestionErrors.filter(
        ({ field }) => field === "qCode"
      );

      return {
        id,
        errors: confirmationQuestionErrors,
        totalCount: confirmationQuestionErrors.length - qCodeErrors.length,
      };
    },
  },

  ConfirmationOption: {
    validationErrorInfo: ({ id }, args, ctx) => {
      const confirmationOptionErrors = ctx.validationErrorInfo.filter(
        ({ confirmationOptionId }) => id === confirmationOptionId
      );

      if (!confirmationOptionErrors) {
        return {
          id,
          errors: [],
          totalCount: 0,
        };
      }

      return {
        id,
        errors: confirmationOptionErrors,
        totalCount: confirmationOptionErrors.length,
      };
    },
  },

  Date: GraphQLDate,
  DateTime: GraphQLDateTime,

  JSON: GraphQLJSON,
};

module.exports = Resolvers;
