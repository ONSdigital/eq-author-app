const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const updateListAnswerMutation = `
  mutation UpdateListAnswer($input: UpdateListAnswerInput!) {
    updateListAnswer(input: $input) {
      id
      displayName
      label
      type
    }
  }
`;

const updateListAnswer = async (ctx, input) => {
  const result = await executeQuery(
    updateListAnswerMutation,
    {
      input: filter(
        gql`
          {
            id
            label
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

  return result.data.updateListAnswer;
};

module.exports = {
  updateListAnswerMutation,
  updateListAnswer,
};
