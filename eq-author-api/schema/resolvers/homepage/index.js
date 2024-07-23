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
        search = "",
        owner = "",
        createdOnOrAfter,
        createdOnOrBefore,
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
          createdOnOrAfter,
          createdOnOrBefore,
          access,
          myQuestionnaires,
          sortBy,
        },
        ctx
      );

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
