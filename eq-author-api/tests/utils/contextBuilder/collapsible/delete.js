const executeQuery = require("../../executeQuery");

const deleteCollapsibleMutation = `
  mutation DeleteCollapsible($input: DeleteCollapsibleInput!) {
    deleteCollapsible(input: $input) {
      id
      collapsibles {
        id
      }
    }
  }
`;

const deleteCollapsible = async (ctx, input) => {
  const result = await executeQuery(deleteCollapsibleMutation, { input }, ctx);
  return result.data.deleteCollapsible;
};

module.exports = {
  deleteCollapsibleMutation,
  deleteCollapsible,
};
