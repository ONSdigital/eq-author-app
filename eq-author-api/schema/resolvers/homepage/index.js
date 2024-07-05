const { listFilteredQuestionnaires } = require("../../../db/datastore");

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
        },
        ctx
      );

      return questionnaires;
    },
  },
};

module.exports = Resolvers;
