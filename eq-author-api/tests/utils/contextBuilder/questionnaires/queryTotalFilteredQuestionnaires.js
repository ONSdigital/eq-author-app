const executeQuery = require("../../executeQuery");

const getTotalFilteredQuestionnairesQuery = `
    query GetTotalFilteredQuestionnaires($input: TotalFilteredQuestionnairesInput) {
        totalFilteredQuestionnaires(input: $input)
    }
`;

const queryTotalFilteredQuestionnaires = async (user, input) => {
  const result = await executeQuery(
    getTotalFilteredQuestionnairesQuery,
    input ? { input } : undefined, // Passes `undefined` when `input` is falsy to test when `input` is not provided
    {
      user,
    }
  );

  return result.data.totalFilteredQuestionnaires;
};

module.exports = {
  getTotalFilteredQuestionnairesQuery,
  queryTotalFilteredQuestionnaires,
};
