const executeQuery = require("../../executeQuery");

const updateQuestionConfirmationMutation = `
  mutation UpdateQuestionConfirmation($input: UpdateQuestionConfirmationInput!) {
    updateQuestionConfirmation(input: $input) {
      id
      title
      positive {
        label
        description
      }
      negative {
        label
        description
      }
      comments {
        id
        commentText
      }
    }
  }
`;

const updateQuestionConfirmation = async (ctx, input) => {
  const result = await executeQuery(
    updateQuestionConfirmationMutation,
    { input },
    ctx
  );
  return result.data.updateQuestionConfirmation;
};

module.exports = {
  updateQuestionConfirmationMutation,
  updateQuestionConfirmation,
};
