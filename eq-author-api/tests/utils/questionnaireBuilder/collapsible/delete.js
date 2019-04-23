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

const deleteCollapsible = async (questionnaire, input) => {
  const result = await executeQuery(
    deleteCollapsibleMutation,
    { input },
    { questionnaire }
  );
  return result.data.deleteCollapsible;
};

module.exports = {
  deleteCollapsibleMutation,
  deleteCollapsible,
};
