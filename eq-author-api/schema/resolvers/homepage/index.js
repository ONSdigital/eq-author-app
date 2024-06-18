const { listFirstPageQuestionnaires } = require("../../../db/datastore");

const Resolvers = {
  Query: {
    firstPageQuestionnaires: async (_, { input = {} }, ctx) => {
      const { limit = 10 } = input;

      const questionnaires = await listFirstPageQuestionnaires({
        limit,
      });

      return questionnaires;
    },
  },
};

module.exports = Resolvers;
