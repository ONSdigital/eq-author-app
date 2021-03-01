const executeQuery = require("../../executeQuery");

const duplicateFolderMutation = `
  mutation duplicateFolder($input: DuplicateFolderInput!) {
    duplicateFolder(input: $input) {
      id
    }
  }
`;

const duplicateFolder = async (ctx, folder) => {
  const input = {
    id: folder.id,
    position: folder.position + 1,
  };

  const result = await executeQuery(duplicateFolderMutation, { input }, ctx);

  return result.data.duplicateFolder;
};

module.exports = {
  duplicateFolderMutation,
  duplicateFolder,
};
