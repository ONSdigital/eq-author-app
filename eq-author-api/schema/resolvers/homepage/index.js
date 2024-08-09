const {
  listFilteredQuestionnaires,
  getTotalPages,
} = require("../../../db/datastore");

const Resolvers = {
  Query: {
    filteredQuestionnaires: async (_, { input }, ctx) => {
      const questionnaires = await listFilteredQuestionnaires(input, ctx);

      return questionnaires;
    },

    totalPages: async (_, { input }, ctx) => {
      const totalPages = await getTotalPages(input, ctx);

      return totalPages;
    },
  },
};

module.exports = Resolvers;
