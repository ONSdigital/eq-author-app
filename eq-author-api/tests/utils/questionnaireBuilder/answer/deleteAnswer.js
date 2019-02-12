const executeQuery = require("../../executeQuery");

const deleteAnswerMutation = `
  mutation deleteAnswer($input: DeleteAnswerInput!) {
    deleteAnswer(input: $input) {
      id
    }
  }
`;

const deleteAnswer = async (questionnaire, id) => {
  const result = await executeQuery(
    deleteAnswerMutation,
    { input: { id } },
    questionnaire
  );
  return result.data.deleteAnswer;
};

module.exports = {
  deleteAnswerMutation,
  deleteAnswer,
};
