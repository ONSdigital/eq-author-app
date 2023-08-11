const executeQuery = require("../../executeQuery");

const updateSubmissionMutation = `
  mutation UpdateSubmission($input: UpdateSubmissionInput!) {
    updateSubmission(input: $input) {
        id
        furtherContent
        viewPrintAnswers
        emailConfirmation
        feedback
        validationErrorInfo {
          totalCount
          errors {
            id
            errorCode
          }
        }
        comments {
            id
            commentText
        }
    }
  }
`;

const updateSubmission = async (ctx, input) => {
  const result = await executeQuery(updateSubmissionMutation, { input }, ctx);
  return result.data.updateSubmission;
};

module.exports = {
  updateSubmissionMutation,
  updateSubmission,
};
