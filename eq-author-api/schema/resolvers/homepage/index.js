const { listFilteredQuestionnaires } = require("../../../db/datastore");

const Resolvers = {
  Query: {
    filteredQuestionnaires: async (_, { input = {} }, ctx) => {
      const {
        limit = 10,
        firstQuestionnaireIdOnPage,
        lastQuestionnaireIdOnPage,
      } = input;

      const questionnaires = await listFilteredQuestionnaires({
        limit,
        firstQuestionnaireIdOnPage,
        lastQuestionnaireIdOnPage,
      });

      return questionnaires;
    },
  },
};

module.exports = Resolvers;
