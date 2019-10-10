const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const updateAnswerMutation = `
  mutation UpdateAnswer($input: UpdateAnswerInput!) {
    updateAnswer(input: $input) {
      id
      description
      guidance
      qCode
      label
      type
      properties
    }
  }
`;

const updateAnswer = async (ctx, input) => {
  const result = await executeQuery(
    updateAnswerMutation,
    {
      input: filter(
        gql`
          {
            id
            description
            guidance
            label
            secondaryLabel
            properties
            qCode
          }
        `,
        input
      ),
    },
    ctx
  );

  return result.data.updateAnswer;
};

module.exports = {
  updateAnswerMutation,
  updateAnswer,
};
