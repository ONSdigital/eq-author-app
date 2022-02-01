const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createFolderMutation = `
  mutation CreateFolder($input: CreateFolderInput!) {
    createFolder(input: $input) {
        id
        alias
        pages {
            id
        }
        position
        section {
         id
        }
        displayName
        validationErrorInfo {
          id
          totalCount
        }
    }
  }
`;

const createFolder = async (ctx, input) => {
  const result = await executeQuery(
    createFolderMutation,
    {
      input: filter(
        gql`
          {
            sectionId
            alias
            position
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

  return result.data.createFolder;
};

module.exports = {
  createFolderMutation,
  createFolder,
};
