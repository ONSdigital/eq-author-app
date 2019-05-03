const executeQuery = require("../../executeQuery");

const toggleValidationMutation = `
  mutation ToggleValidationRule($input: ToggleValidationRuleInput!) {
    toggleValidationRule(input: $input) {
      id
      enabled
    }
  }
`;

const toggleValidation = async (ctx, input) => {
  const result = await executeQuery(toggleValidationMutation, { input }, ctx);

  return result.data.toggleValidationRule;
};

module.exports = {
  toggleValidationMutation,
  toggleValidation,
};
