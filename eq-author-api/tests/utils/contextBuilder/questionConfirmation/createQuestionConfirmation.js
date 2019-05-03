const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createQuestionConfirmationMutation = `
  mutation CreateQuestionConfirmation($input: CreateQuestionConfirmationInput!) {
    createQuestionConfirmation(input: $input) {
      id
      title 
      negative {
        description
        label
      }
      positive {
        description
        label
      }
    }
  }
`;

const createQuestionConfirmation = async (ctx, input) => {
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
    ctx
  );
  return result.data.createQuestionConfirmation;
};

module.exports = {
  createQuestionConfirmationMutation,
  createQuestionConfirmation,
};
