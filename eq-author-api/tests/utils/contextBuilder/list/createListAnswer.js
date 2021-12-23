const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createListMutation = `
  mutation CreateListAnswer($input: CreateListAnswerInput!) {
    createListAnswer(input: $input) {
      id 
      answers {
        id
        displayName
        type
      }
    }
  }
`;

const createListAnswer = async (ctx, input) => {
  const result = await executeQuery(
    createListMutation,
    {
      input: filter(
        gql`
          {
            listId
            type
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

  return result.data.createListAnswer;
};

module.exports = {
  createListMutation,
  createListAnswer,
};
