const executeQuery = require("../../executeQuery");

const getAnswerQuery = `
  query GetAnswer($input: QueryInput!) {
    answer(input: $input) {
      id
      description
      guidance
      qCode
      label
      type
      properties
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
    questionnaire
  );

  return result.data.answer;
};

module.exports = {
  getAnswerQuery,
  queryAnswer,
};
