const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createQuestionConfirmationMutation = `
  mutation CreateQuestionConfirmation($input: CreateQuestionConfirmationInput!) {
    createQuestionConfirmation(input: $input) {
      id
    }
  }
`;

const createQuestionConfirmation = async (questionnaire, input) => {
  const result = await executeQuery(
    createQuestionConfirmationMutation,
    {
      input: filter(
        gql`
          {
            pageId
          }
        `,
        input
      ),
    },
    { questionnaire }
  );
  return result.data.createQuestionConfirmation;
};

module.exports = {
  createQuestionConfirmationMutation,
  createQuestionConfirmation,
};
