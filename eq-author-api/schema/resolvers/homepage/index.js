const {
  listFilteredQuestionnaires,
  getTotalPages,
} = require("../../../db/datastore");

const Resolvers = {
  Query: {
    filteredQuestionnaires: async (_, { input = {} }, ctx) => {
      const {
        resultsPerPage = 10,
        firstQuestionnaireIdOnPage,
        lastQuestionnaireIdOnPage,
        search,
        owner,
        createdAfter,
        createdBefore,
        access,
        myQuestionnaires,
        sortBy,
      } = input;

      const questionnaires = await listFilteredQuestionnaires(
        {
          resultsPerPage,
          firstQuestionnaireIdOnPage,
          lastQuestionnaireIdOnPage,
          search,
          owner,
          createdAfter,
          createdBefore,
          access,
          myQuestionnaires,
          sortBy,
        },
        ctx
      );

      return questionnaires;
    },

    totalPages: async (_, { input = {} }) => {
      const { resultsPerPage = 10 } = input;

      return getTotalPages(resultsPerPage);
    },
  },
};

module.exports = Resolvers;
