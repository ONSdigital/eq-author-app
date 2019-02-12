const executeQuery = require("../../executeQuery");

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
    { input },
    questionnaire
  );

  return result.data.createAnswer;
};

module.exports = {
  createAnswerMutation,
  createAnswer,
};
