const executeQuery = require("../../executeQuery");

const updateAnswerMutation = `
  mutation UpdateAnswer($input: UpdateAnswerInput!) {
    updateAnswer(input: $input) {
      id
      description
      guidance
      qCode
      label
      type
      properties
    }
  }
`;

const updateAnswer = async (ctx, input) => {
  const result = await executeQuery(updateAnswerMutation, { input }, ctx);

  return result.data.updateAnswer;
};

module.exports = {
  updateAnswerMutation,
  updateAnswer,
};
