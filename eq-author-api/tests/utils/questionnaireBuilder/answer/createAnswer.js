const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createAnswerMutation = `
  mutation CreateAnswer($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id
    }
  }
`;

const createAnswer = async (questionnaire, input) => {
  const result = await executeQuery(
    createAnswerMutation,
    {
      input: filter(
        gql`
          {
            description
            guidance
            label
            secondaryLabel
            qCode
            type
            questionPageId
          }
        `,
        input
      ),
    },
    questionnaire
  );

  return result.data.createAnswer;
};

module.exports = {
  createAnswerMutation,
  createAnswer,
};
