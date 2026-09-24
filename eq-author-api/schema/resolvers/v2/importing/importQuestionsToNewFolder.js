const {
  getPagesByIds,
  getSectionById,
  stripQCodes,
  remapAllNestedIds,
  setDataVersion,
} = require("../../utils");
const removeExtraSpaces = require("../../../../utils/removeExtraSpaces");

const createFolder = require("../../../../src/businessLogic/createFolder");

const { getQuestionnaire } = require("../../../../db/datastore");
const { UserInputError } = require("apollo-server-express");

const { createMutation } = require("../../createMutation");

module.exports = {
  Mutation: {
    importQuestionsToNewFolder: createMutation(
      async (_, { input: { questionnaireId, questionIds, position } }, ctx) => {
        const { sectionId, index: insertionIndex } = position;

        if (!sectionId) {
          throw new UserInputError("Target section ID must be provided.");
        }

        const sourceQuestionnaire = await getQuestionnaire(questionnaireId);
        if (!sourceQuestionnaire) {
          throw new UserInputError(
            `Questionnaire with ID ${questionnaireId} does not exist.`
          );
        }

        const pages = getPagesByIds(
          { questionnaire: sourceQuestionnaire },
          questionIds
        );
        if (pages.length !== questionIds.length) {
          throw new UserInputError(
            `Not all page IDs in [${questionIds}] exist in source questionnaire ${questionnaireId}.`
          );
        }

        pages.forEach((page) => {
          removeExtraSpaces(page);
          if (page.answers.length === 1) {
            if (page.answers[0].repeatingLabelAndInputListId) {
              page.answers[0].repeatingLabelAndInputListId = "";
            }
          }
        });

        // Re-create UUIDs, strip QCodes, routing and skip conditions from imported pages
        // Keep piping intact for now - will show "[Deleted answer]" to users when piped ID not resolvable
        const strippedPages = remapAllNestedIds(
          stripQCodes(
            pages.map((page) => ({
              ...page,
              skipConditions: null,
              routing: null,
            }))
          )
        );

        const section = getSectionById(ctx, sectionId);
        if (!section) {
          throw new UserInputError(
            `Section with ID ${sectionId} doesn't exist in target questionnaire.`
          );
        }

        // Insert imported pages into a single new folder
        section.folders.splice(
          insertionIndex,
          0,
          createFolder({ pages: strippedPages })
        );

        setDataVersion(ctx);

        return section;
      }
    ),
  },
};
