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

const updateCollapsible = async (ctx, input) => {
  const result = await executeQuery(updateCollapsibleMutation, { input }, ctx);
  return result.data.updateCollapsible;
};

module.exports = {
  updateCollapsibleMutation,
  updateCollapsible,
};
