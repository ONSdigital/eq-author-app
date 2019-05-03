const executeQuery = require("../../executeQuery");

const deleteQuestionConfirmationMutation = `
  mutation deleteQuestionConfirmation($input: DeleteQuestionConfirmationInput!) {
    deleteQuestionConfirmation(input: $input) {
      id
    }
  }
`;

const deleteQuestionConfirmation = async (ctx, id) => {
  const result = await executeQuery(
    deleteQuestionConfirmationMutation,
    { input: { id } },
    ctx
  );
  return result.data.deleteQuestionConfirmation;
};

module.exports = {
  deleteQuestionConfirmationMutation,
  deleteQuestionConfirmation,
};
