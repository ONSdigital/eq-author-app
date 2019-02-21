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
    }
  }
`;

const updateQuestionConfirmation = async (questionnaire, input) => {
  const result = await executeQuery(
    updateQuestionConfirmationMutation,
    { input },
    questionnaire
  );
  return result.data.updateQuestionConfirmation;
};

module.exports = {
  updateQuestionConfirmationMutation,
  updateQuestionConfirmation,
};
