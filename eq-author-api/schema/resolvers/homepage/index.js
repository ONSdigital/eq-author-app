const {
  listFirstPageQuestionnaires,
  listNextPageQuestionnaires,
} = require("../../../db/datastore");

const Resolvers = {
  Query: {
    firstPageQuestionnaires: async (_, { input = {} }, ctx) => {
      const { limit = 10 } = input;

      const questionnaires = await listFirstPageQuestionnaires({
        limit,
      });

      return questionnaires;
    },

    nextPageQuestionnaires: async (_, { input = {} }, ctx) => {
      const { limit = 10, lastQuestionnaireIdOnPage } = input;

      const nextQuestionnaires = await listNextPageQuestionnaires({
        limit,
        lastQuestionnaireIdOnPage,
      });

      return nextQuestionnaires;
    },
  },
};

module.exports = Resolvers;
