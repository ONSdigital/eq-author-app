const executeQuery = require("../../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const mutation = `
  mutation ImportQuestionsToNewFolder($input: ImportQuestionsInput!) {
    importQuestionsToNewFolder(input: $input) {
      id
    }
  }
`;

const importQuestionsToNewFolder = async (ctx, input) => {
  const result = await executeQuery(
    mutation,
    {
      input: filter(
        gql`
          {
            questionnaireId
            questionIds
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

  return result.data.importQuestionsToNewFolder;
};

module.exports = {
  mutation,
  importQuestionsToNewFolder,
};
