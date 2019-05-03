const executeQuery = require("../../executeQuery");

const deleteAnswerMutation = `
  mutation deleteAnswer($input: DeleteAnswerInput!) {
    deleteAnswer(input: $input) {
      id
    }
  }
`;

const deleteAnswer = async (ctx, id) => {
  const result = await executeQuery(
    deleteAnswerMutation,
    { input: { id } },
    ctx
  );
  return result.data.deleteAnswer;
};

module.exports = {
  deleteAnswerMutation,
  deleteAnswer,
};
