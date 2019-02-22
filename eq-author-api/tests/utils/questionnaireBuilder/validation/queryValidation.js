const executeQuery = require("../../executeQuery");

const getValidationQuery = `
  query GetValidation($input: QueryInput!) {
    answer(input: $input) {
      id
      ... on BasicAnswer {
        validation {
          ... on NumberValidation {
            minValue {
              enabled
              ...MinValueValidationRule
            }
            maxValue {
              enabled
              ...MaxValueValidationRule
            }
          }
          ... on DateValidation {
            earliestDate {
              enabled
              ...EarliestDateValidationRule
            }
            latestDate {
              enabled
              ...LatestDateValidationRule
            }
          }
          ... on DateRangeValidation {
            earliestDate {
              enabled
              ...EarliestDateValidationRule
            }
            latestDate {
              enabled
              ...LatestDateValidationRule
            }
            minDuration {
              enabled
              ...MinDurationValidationRule
            }
            maxDuration {
              enabled
              ...MaxDurationValidationRule
            }
          }
        }
      }
    }
  }
  
  fragment MinValueValidationRule on MinValueValidationRule {
    id
    enabled
    custom
    inclusive
    entityType
  }
  
  fragment MaxValueValidationRule on MaxValueValidationRule {
    id
    enabled
    custom
    inclusive
    entityType
  }
  
  fragment EarliestDateValidationRule on EarliestDateValidationRule {
    id
    enabled
    entityType
    custom
    offset {
      value
      unit
    }
    relativePosition
  }
  
  fragment LatestDateValidationRule on LatestDateValidationRule {
    id
    enabled
    entityType
    custom
    offset {
      value
      unit
    }
    relativePosition
  }
  
  fragment MinDurationValidationRule on MinDurationValidationRule {
    id
    enabled
    duration {
      value
      unit
    }
  }
  
  fragment MaxDurationValidationRule on MaxDurationValidationRule {
    id
    enabled
    duration {
      value
      unit
    }
  }
`;

const queryValidation = async (questionnaire, answerId) => {
  const result = await executeQuery(
    getValidationQuery,
    {
      input: { answerId },
    },
    { questionnaire }
  );

  return result.data.answer.validation;
};

module.exports = {
  getValidationQuery,
  queryValidation,
};
