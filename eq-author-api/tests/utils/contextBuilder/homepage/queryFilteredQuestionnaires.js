const executeQuery = require("../../executeQuery");

const getFilteredQuestionnairesQuery = `
    query GetFilteredQuestionnaires($input: FilteredQuestionnairesInput) {
        filteredQuestionnaires(input: $input) {
            id
            title
            shortTitle
            createdBy {
                id
                name
            }
            createdAt
            editors {
                id
            }
            permission
        }
    }
`;

const queryFilteredQuestionnaires = async (user, input) => {
  const result = await executeQuery(
    getFilteredQuestionnairesQuery,
    { input },
    {
      user,
    }
  );

  return result.data.filteredQuestionnaires;
};

module.exports = {
  getFilteredQuestionnairesQuery,
  queryFilteredQuestionnaires,
};
