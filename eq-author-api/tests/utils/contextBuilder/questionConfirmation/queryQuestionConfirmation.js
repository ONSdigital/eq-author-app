const executeQuery = require("../../executeQuery");

const getQuestionConfirmationQuery = `
  query GetQuestionConfirmation($id: ID!) {
    questionConfirmation(id: $id) {
      id
      title
      positive {
        id
        label
        description
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
      negative {
        id
        label
        description
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
      page {
        id
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

const queryQuestionConfirmation = async (ctx, id) => {
  const result = await executeQuery(getQuestionConfirmationQuery, { id }, ctx);

  return result.data.questionConfirmation;
};

module.exports = {
  getQuestionConfirmationQuery,
  queryQuestionConfirmation,
};
