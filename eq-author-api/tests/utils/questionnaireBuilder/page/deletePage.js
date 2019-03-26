const executeQuery = require("../../executeQuery");

const deletePageMutation = `
  mutation deletePage($input: DeletePageInput!) {
    deletePage(input: $input) {
      id
    }
  }
`;

const deletePage = async (questionnaire, id) => {
  const result = await executeQuery(
    deletePageMutation,
    { input: { id } },
    { questionnaire }
  );
  return result.data.deletePage;
};

module.exports = {
  deletePageMutation,
  deletePage,
};
