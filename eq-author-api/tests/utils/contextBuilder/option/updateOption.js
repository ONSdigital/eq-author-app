const executeQuery = require("../../executeQuery");

const updateOptionMutation = `
  mutation UpdateOption($input: UpdateOptionInput!) {
    updateOption(input: $input) {
      id
      displayName
      label
      description
      value
      qCode
      additionalAnswer {
        id
        label
      }
      dynamicAnswer
      dynamicAnswerID
    }
  }
`;

const updateOption = async (ctx, input) => {
  const result = await executeQuery(updateOptionMutation, { input }, ctx);

  return result.data.updateOption;
};

module.exports = {
  updateOptionMutation,
  updateOption,
};
