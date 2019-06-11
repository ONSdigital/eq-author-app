const executeQuery = require("../../executeQuery");

const getAnswerQuery = `
  query GetAnswer($input: QueryInput!) {
    answer(input: $input) {
      id
      displayName
      description
      guidance
      qCode
      label
      secondaryLabel
      secondaryLabelDefault
      type
      page {
        id
      }
      properties
      ... on BasicAnswer {
        validation {
          ... on NumberValidation {
            minValue {
              id
            }
            maxValue {
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
          additionalAnswer{
            id
            type
            description
          }
        }
      }
    }
  }
`;

const queryAnswer = async (ctx, answerId) => {
  const result = await executeQuery(
    getAnswerQuery,
    {
      input: { answerId },
    },
    ctx
  );

  return result.data.answer;
};

module.exports = {
  getAnswerQuery,
  queryAnswer,
};
