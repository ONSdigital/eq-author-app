const executeQuery = require("../../executeQuery");

const updateAnswersOfTypeMutation = `
  mutation UpdateAnswersOfType($input: UpdateAnswersOfTypeInput!) {
    updateAnswersOfType(input: $input) {
      id
      properties
    }
  }
`;

const updateAnswersOfType = async (questionnaire, input) => {
  const result = await executeQuery(
    updateAnswersOfTypeMutation,
    { input },
    { questionnaire }
  );

  return result.data.updateAnswersOfType;
};

module.exports = {
  updateAnswersOfTypeMutation,
  updateAnswersOfType,
};
