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
    }
  }
`;

const updateAnswer = async (questionnaire, input) => {
  const result = await executeQuery(
    updateAnswerMutation,
    { input },
    questionnaire
  );

  return result.data;
};

module.exports = {
  updateAnswerMutation,
  updateAnswer,
};
