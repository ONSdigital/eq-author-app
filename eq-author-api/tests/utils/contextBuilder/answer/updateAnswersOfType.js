const executeQuery = require("../../executeQuery");

const updateAnswersOfTypeMutation = `
  mutation UpdateAnswersOfType($input: UpdateAnswersOfTypeInput!) {
    updateAnswersOfType(input: $input) {
      id
      properties
    }
  }
`;

const updateAnswersOfType = async (ctx, input) => {
  const result = await executeQuery(
    updateAnswersOfTypeMutation,
    { input },
    ctx
  );

  return result.data.updateAnswersOfType;
};

module.exports = {
  updateAnswersOfTypeMutation,
  updateAnswersOfType,
};
