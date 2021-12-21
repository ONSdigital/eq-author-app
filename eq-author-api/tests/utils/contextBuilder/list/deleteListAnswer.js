const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const deleteListAnswerMutation = `
  mutation DeleteListAnswer($input: DeleteListAnswerInput) {
    deleteListAnswer(input: $input) {
      id
      listName
      displayName
    }
  }
`;

const deleteListAnswer = async (ctx, input) => {
  const result = await executeQuery(
    deleteListAnswerMutation,
    {
      input: filter(
        gql`
          {
            id
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

  return result.data.deleteListAnswer;
};

module.exports = {
  deleteListAnswerMutation,
  deleteListAnswer,
};
