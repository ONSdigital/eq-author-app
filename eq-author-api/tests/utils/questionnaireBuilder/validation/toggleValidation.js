const executeQuery = require("../../executeQuery");

const toggleValidationMutation = `
  mutation ToggleValidationRule($input: ToggleValidationRuleInput!) {
    toggleValidationRule(input: $input) {
      id
    }
  }
`;

const toggleValidation = async (questionnaire, input) => {
  const result = await executeQuery(
    toggleValidationMutation,
    { input },
    { questionnaire }
  );

  return result.data.toggleValidationRule;
};

module.exports = {
  toggleValidationMutation,
  toggleValidation,
};
