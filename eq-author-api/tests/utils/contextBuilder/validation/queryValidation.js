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

  fragment ValidationErrorInfo on ValidationErrorInfo {
    id
    errors {
      id
      type
      field
      errorCode
    }
    totalCount
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
    validationErrorInfo {
      ...ValidationErrorInfo
    }
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
    validationErrorInfo {
      ...ValidationErrorInfo
    }
  }
  
  fragment MinDurationValidationRule on MinDurationValidationRule {
    id
    enabled
    duration {
      value
      unit
    }
    validationErrorInfo {
      ...ValidationErrorInfo
    }
  }
  
  fragment MaxDurationValidationRule on MaxDurationValidationRule {
    id
    enabled
    duration {
      value
      unit
    }
    validationErrorInfo {
      ...ValidationErrorInfo
    }
  }
`;

const queryValidation = async (ctx, answerId) => {
  const result = await executeQuery(
    getValidationQuery,
    {
      input: { answerId },
    },
    ctx
  );

  return result.data.answer.validation;
};

module.exports = {
  getValidationQuery,
  queryValidation,
};
