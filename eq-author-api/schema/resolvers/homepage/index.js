const {
  listFilteredQuestionnaires,
  getTotalPages,
} = require("../../../db/datastore");

const Resolvers = {
  Query: {
    filteredQuestionnaires: async (_, { input = {} }, ctx) => {
      const questionnaires = await listFilteredQuestionnaires(input, ctx);

      return questionnaires;
    },

    totalPages: async (_, { input = {} }, ctx) => {
      const {
        resultsPerPage = 10,
        search = "",
        owner = "",
        createdOnOrAfter,
        createdOnOrBefore,
        access,
        myQuestionnaires,
      } = input;

      const totalPages = await getTotalPages(
        {
          resultsPerPage,
          search,
          owner,
          createdOnOrAfter,
          createdOnOrBefore,
          access,
          myQuestionnaires,
        },
        ctx
      );
      return totalPages;
    },
  },
};

module.exports = Resolvers;
