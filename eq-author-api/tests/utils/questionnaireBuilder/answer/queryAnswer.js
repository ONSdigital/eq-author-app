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

const queryAnswer = async (questionnaire, answerId) => {
  const result = await executeQuery(
    getAnswerQuery,
    {
      input: { answerId },
    },
    { questionnaire }
  );

  return result.data.answer;
};

module.exports = {
  getAnswerQuery,
  queryAnswer,
};
