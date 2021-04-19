const executeQuery = require("../../executeQuery");

const moveFolderMutation = `
    mutation MoveFolderMutation($input: MoveFolderInput!) {
        moveFolder(input: $input) {
        id
        alias
        displayName
        enabled
        pages {
            id
            title
            position
        }
        section {
            id
        }
        position
        }
  }
`;

const moveFolder = async (ctx, input) => {
  const result = await executeQuery(
    moveFolderMutation,
    {
      input,
    },
    ctx
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.moveFolder;
};

module.exports = {
  moveFolderMutation,
  moveFolder,
};
