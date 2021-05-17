const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const mutation = `
  mutation ImportQuestions($input: ImportQuestionsInput!) {
    importQuestions(input: $input) {
      id
    }
  }
`;

const importQuestions = async (ctx, input) => {
  const result = await executeQuery(
    mutation,
    {
      input: filter(
        gql`
          {
            questionnaireId
            questionIds
            position {
              folderId
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

  return result.data.importQuestions;
};

module.exports = {
  mutation,
  importQuestions,
};
