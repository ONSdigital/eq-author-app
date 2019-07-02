const executeQuery = require("../../executeQuery");
const { ANSWERS } = require("../../../../constants/validationErrorTypes");

const getAnswerQuery = `
  query GetAnswer($input: QueryInput!) {
    answer(input: $input) {
      id
      displayName
      description
      guidance
      qCode
      label
      secondaryLabel
      secondaryLabelDefault
      type
      page {
        id
      }
      properties
      ... on BasicAnswer {
        validation {
          ... on NumberValidation {
            minValue {
              id
            }
            maxValue {
              id
            }
          }
        }
        validationErrorInfo {
          errors {
            id
            type
            field
            errorCode
          }
          totalCount
        }
      }
      ... on MultipleChoiceAnswer {
        mutuallyExclusiveOption {
          id
        }
        options {
          id
          additionalAnswer{
            id
            type
            description
          }
          validationErrorInfo {
            errors {
              id
              type
              field
              errorCode
            }
            totalCount
          }
        }
        validationErrorInfo {
          errors {
            id
            type
            field
            errorCode
          }
          totalCount
        }
      }
    }
  }
`;

const queryAnswer = async (ctx, answerId) => {
  const result = await executeQuery(
    getAnswerQuery,
    {
      input: { answerId },
    },
    ctx
  );

  const pageValidationErrors =
    ctx.validationErrorInfo &&
    ctx.validationErrorInfo.filter(
      errInfo => errInfo.id === answerId && errInfo.type === ANSWERS
    );

  if (result.data.answer && pageValidationErrors) {
    return {
      ...result.data.answer,
      validationErrorInfo: {
        errors: pageValidationErrors,
        totalCount: pageValidationErrors.length,
      },
    };
  }

  return result.data.answer;
};

module.exports = {
  getAnswerQuery,
  queryAnswer,
};
