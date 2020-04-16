const executeQuery = require("../../executeQuery");

const updateValidationMutation = `
  mutation updateValidationRule($input: UpdateValidationRuleInput!) {
    updateValidationRule(input: $input) {
      id
      ...on MinValueValidationRule {
        custom
        inclusive
        entityType
        previousAnswer {
          id
        }
      }
      ...on MaxValueValidationRule {
        custom
        inclusive
        entityType
        previousAnswer {
          id
        }
      }
      ...on EarliestDateValidationRule {
        customDate: custom
        offset {
          value
          unit
        }
        relativePosition
        entityType
        previousAnswer {
          id
        }
        metadata {
          id
        }
      }
      ...on LatestDateValidationRule {
        customDate: custom
        offset {
          value
          unit
        }
        relativePosition
        entityType
        previousAnswer {
          id
        }
        metadata {
          id
        }
      }
      ...on MinDurationValidationRule {
        duration {
          value
          unit
        }
      }
      ...on MaxDurationValidationRule {
        duration {
          value
          unit
        }
      }
    }
  }
`;

const updateValidation = async (ctx, input) => {
  const result = await executeQuery(updateValidationMutation, { input }, ctx);

  return result.data.updateValidationRule;
};

module.exports = {
  updateValidationMutation,
  updateValidation,
};
