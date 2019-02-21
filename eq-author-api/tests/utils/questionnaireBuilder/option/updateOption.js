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
      }
    }
  }
`;

const updateOption = async (questionnaire, input) => {
  const result = await executeQuery(
    updateOptionMutation,
    { input },
    { questionnaire }
  );

  return result.data.updateOption;
};

module.exports = {
  updateOptionMutation,
  updateOption,
};
