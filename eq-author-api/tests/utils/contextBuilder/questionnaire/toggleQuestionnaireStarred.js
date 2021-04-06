const executeQuery = require("../../executeQuery");

const mutation = `
mutation ToggleQuestionnaireStarred($input: ToggleQuestionnaireStarredInput!) {
    toggleQuestionnaireStarred(input: $input) {
      id
      starred
    }
  }
`;

const toggleQuestionnaireStarred = async (input, ctx) => {
  const result = await executeQuery(mutation, { input }, ctx);
  return result.data.toggleQuestionnaireStarred;
};

module.exports = {
  toggleQuestionnaireStarred,
};
