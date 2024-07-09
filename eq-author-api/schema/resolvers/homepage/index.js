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
  },
};

module.exports = Resolvers;
