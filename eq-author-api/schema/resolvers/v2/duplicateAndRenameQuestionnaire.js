const { isNil } = require("lodash");
const { v4: uuidv4 } = require("uuid");
const { UserInputError } = require("apollo-server-express");

const { createQuestionnaire, getQuestionnaire } = require("../../../db/datastore");
const { UNPUBLISHED } = require("../../../constants/publishStatus");
const addPrefix = require("../../../utils/addPrefix");
const { logger } = require("../../../utils/logger");

const Resolvers = {
  Mutation: {
    duplicateAndRenameQuestionnaire: async (root, { input }, context) => {
      const sourceQuestionnaire = await getQuestionnaire(input.id);

      if (!sourceQuestionnaire) {
        throw new UserInputError(
          `Questionnaire with ID ${input.id} does not exist.`
        );
      }

      const hasCustomTitle = !isNil(input.title);
      const hasCustomShortTitle = !isNil(input.shortTitle);

      if (hasCustomTitle) {
        if (typeof input.title !== "string" || input.title.trim() === "") {
          throw new UserInputError("title must be a non-empty string.");
        }
      }

      const duplicatedQuestionnaire = {
        ...sourceQuestionnaire,
        title: hasCustomTitle ? input.title : addPrefix(sourceQuestionnaire.title),
        shortTitle: hasCustomShortTitle
          ? input.shortTitle
          : addPrefix(sourceQuestionnaire.shortTitle),
        id: uuidv4(),
        createdBy: context.user.id,
        createdAt: new Date(),
        editors: [],
        publishStatus: UNPUBLISHED,
        publishHistory: [],
        surveyVersion: 1,
        locked: false,
      };

      let createdQuestionnaire;
      try {
        createdQuestionnaire = await createQuestionnaire(
          duplicatedQuestionnaire,
          context
        );
      } catch (error) {
        logger.error(
          {
            sourceQuestionnaireId: sourceQuestionnaire.id,
            hasCustomTitle,
            hasCustomShortTitle,
            error,
          },
          `Failed to duplicate questionnaire - source: "${sourceQuestionnaire.title}"`
        );
        throw error;
      }

      logger.info(
        {
          sourceQuestionnaireId: sourceQuestionnaire.id,
          duplicatedQuestionnaireId: createdQuestionnaire.id,
          hasCustomTitle,
          hasCustomShortTitle,
        },
        `Duplicated questionnaire - source: "${sourceQuestionnaire.title}", new: "${createdQuestionnaire.title}"`
      );

      return createdQuestionnaire;
    },
  },
};

module.exports = Resolvers;

