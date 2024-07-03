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
      } = input;

      const questionnaires = await listFilteredQuestionnaires({
        resultsPerPage,
        firstQuestionnaireIdOnPage,
        lastQuestionnaireIdOnPage,
        search,
        owner,
        createdAfter,
        createdBefore,
      });

      return questionnaires;
    },
  },
};

module.exports = Resolvers;
