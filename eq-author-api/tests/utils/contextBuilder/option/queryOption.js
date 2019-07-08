const executeQuery = require("../../executeQuery");
const { OPTIONS } = require("../../../../constants/validationErrorTypes");

const getOptionQuery = `
  query GetOption($input: QueryInput!) {
    option(input: $input) {
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
`;

const queryOption = async (ctx, id) => {
  const result = await executeQuery(
    getOptionQuery,
    {
      input: { optionId: id },
    },
    ctx
  );

  const pageValidationErrors =
    ctx.validationErrorInfo &&
    ctx.validationErrorInfo.filter(
      errInfo => errInfo.id === id && errInfo.type === OPTIONS
    );

  if (result.data.option && pageValidationErrors) {
    return {
      ...result.data.option,
      validationErrorInfo: {
        errors: pageValidationErrors,
        totalCount: pageValidationErrors.length,
      },
    };
  }

  return result.data.option;
};

module.exports = {
  getOptionQuery,
  queryOption,
};
