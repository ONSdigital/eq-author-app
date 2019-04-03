const executeQuery = require("../../executeQuery");

const updateCollapsibleMutation = `
  mutation UpdateCollapsible($input: UpdateCollapsibleInput!) {
    updateCollapsible(input: $input) {
      id
      title
      description
    }
  }
`;

const updateCollapsible = async (questionnaire, input) => {
  const result = await executeQuery(
    updateCollapsibleMutation,
    { input },
    { questionnaire }
  );
  return result.data.updateCollapsible;
};

module.exports = {
  updateCollapsibleMutation,
  updateCollapsible,
};
