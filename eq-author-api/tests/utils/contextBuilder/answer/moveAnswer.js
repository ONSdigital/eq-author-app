const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const executeQuery = require("../../executeQuery");

const moveAnswerQuery = `
  mutation MoveAnswer($input: MoveAnswerInput!) {
    moveAnswer(input: $input) {
      id
      page {
        id
        answers {
          id
        }
      }
    }
  }
`;

const moveAnswer = async (ctx, input) => {
  const result = await executeQuery(
    moveAnswerQuery,
    {
      input: filter(
        gql`
          {
            id
            position
          }
        `,
        input
      ),
    },
    ctx
  );

  return result.data.moveAnswer;
};

module.exports = {
  moveAnswerQuery,
  moveAnswer,
};
