const {
  getPagesByIds,
  getFolderById,
  getSectionById,
  getSectionByFolderId,
  stripQCodes,
  remapAllNestedIds,
  getSectionsByIds,
} = require("./utils");

const createFolder = require("../../src/businessLogic/createFolder");

const { getQuestionnaire } = require("../../db/datastore");
const { UserInputError } = require("apollo-server-express");

const { createMutation } = require("./createMutation");

module.exports = {
  Mutation: {
    importQuestions: createMutation(
      async (_, { input: { questionnaireId, questionIds, position } }, ctx) => {
        const { sectionId, folderId, index: insertionIndex } = position;

        if (!sectionId && !folderId) {
          throw new UserInputError(
            "Target folder or section ID must be provided."
          );
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

        let section;
        if (folderId) {
          const folder = getFolderById(ctx, folderId);
          if (!folder) {
            throw new UserInputError(
              `Folder with ID ${folderId} doesn't exist in target questionnaire.`
            );
          }
          folder.pages.splice(insertionIndex, 0, ...strippedPages);
          section = getSectionByFolderId(ctx, folderId);
        } else {
          section = getSectionById(ctx, sectionId);
          if (!section) {
            throw new UserInputError(
              `Section with ID ${sectionId} doesn't exist in target questionnaire.`
            );
          }

          // Insert each imported page into its own disabled folder per EAR-1315
          section.folders.splice(
            insertionIndex,
            0,
            ...strippedPages.map((page) => createFolder({ pages: [page] }))
          );
        }

        return section;
      }
    ),
    importSections: createMutation(
      async (_, { input: { questionnaireId, sectionIds, position } }, ctx) => {
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

        const sourceSections = getSectionsByIds(
          { questionnaire: sourceQuestionnaire },
          sectionIds
        );

        const destinationSections = ctx.questionnaire.sections;

        if (sourceSections.length !== sectionIds.length) {
          throw new UserInputError(
            `Not all section IDs in [${sectionIds}] exist in source questionnaire ${questionnaireId}.`
          );
        }

        let sectionsWithoutLogic = [];

        // Re-create UUIDs, strip QCodes, routing and skip conditions from imported pages
        // Keep piping intact for now - will show "[Deleted answer]" to users when piped ID not resolvable

        sourceSections.forEach((section) => {
          remapAllNestedIds(section);
          section.displayConditions = null;
          section.questionnaireId = ctx.questionnaire.id;
          section.folders.forEach((folder) => {
            folder.skipConditions = null;
            folder.pages.forEach((page) => {
              page.routing = null;
              page.skipConditions = null;
              page.answers.forEach((answer) => {
                return stripQCodes(answer);
              });
            });
          });

          sectionsWithoutLogic.push(section);
        });

        const section = getSectionById(ctx, sectionId);
        if (!section) {
          throw new UserInputError(
            `Section with ID ${sectionId} doesn't exist in target questionnaire.`
          );
        }

        destinationSections.splice(insertionIndex, 0, ...sectionsWithoutLogic);

        return destinationSections;
      }
    ),
  },
};
