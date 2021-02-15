const executeQuery = require("../../executeQuery");

const deleteFolderMutation = `
  mutation deleteFolder($input: DeleteFolderInput!) {
    deleteFolder(input: $input) {
      id
    }
  }
`;

const deleteFolder = async (ctx, id) => {
  const result = await executeQuery(
    deleteFolderMutation,
    { input: { id } },
    ctx
  );
  return result.data.deleteFolder;
};

module.exports = {
  deleteFolderMutation,
  deleteFolder,
};
