const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createAnswerMutation = `
  mutation CreateAnswer($input: CreateAnswerInput!) {
    createAnswer(input: $input) {
      id
      description
      guidance
      label
      secondaryLabel
      qCode
      ...on BasicAnswer{
        validation {
          ...on NumberValidation {
            minValue {
              id
            }
          }
        }
      }
      ... on MultipleChoiceAnswer {
        mutuallyExclusiveOption {
          id
        }
        options {
          id
          displayName
          label
          description
          value
          qCode
          answer {
            id
          }
          additionalAnswer {
            id
          }
        }
      }
    }
  }
`;

const createAnswer = async (ctx, input) => {
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
    ctx
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.createAnswer;
};

module.exports = {
  createAnswerMutation,
  createAnswer,
};
