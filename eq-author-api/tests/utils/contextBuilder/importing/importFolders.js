const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const mutation = `
mutation ImportFolders($input: ImportFoldersInput!) {
  importFolders(input: $input) {
    id
  }
}
`;

const importFolders = async (ctx, input) => {
  const result = await executeQuery(
    mutation,
    {
      input: filter(
        gql`
          {
            questionnaireId
            folderIds
            position {
              sectionId
              index
            }
          }
        `,
        input
      ),
    },
    ctx
  );

  return result.data.importFolders;
};

module.exports = {
  mutation,
  importFolders,
};
