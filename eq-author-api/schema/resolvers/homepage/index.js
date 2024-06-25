const { listFilteredQuestionnaires } = require("../../../db/datastore");

const Resolvers = {
  Query: {
    filteredQuestionnaires: async (_, { input = {} }, ctx) => {
      const {
        resultsPerPage = 10,
        firstQuestionnaireIdOnPage,
        lastQuestionnaireIdOnPage,
      } = input;

      const questionnaires = await listFilteredQuestionnaires({
        resultsPerPage,
        firstQuestionnaireIdOnPage,
        lastQuestionnaireIdOnPage,
      });

      return questionnaires;
    },
  },
};

module.exports = Resolvers;
