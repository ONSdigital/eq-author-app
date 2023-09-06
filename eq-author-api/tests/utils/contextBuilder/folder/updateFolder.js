const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const updateFolderMutation = `
mutation UpdateFolder($input: UpdateFolderInput!) {
    updateFolder(input: $input) {
      id
      alias
      displayName
      title
      ... on ListCollectorFolder {
        listId
      }
      validationErrorInfo {
        id
        totalCount
      }
    }
  }
`;

const updateFolder = async (ctx, input) => {
  const result = await executeQuery(
    updateFolderMutation,
    {
      input: filter(
        gql`
          {
            folderId
            alias
            title
            listId
          }
        `,
        input
      ),
    },
    ctx
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.updateFolder;
};

module.exports = {
  updateFolderMutation,
  updateFolder,
};
