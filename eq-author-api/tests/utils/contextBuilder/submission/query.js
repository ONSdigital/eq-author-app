const executeQuery = require("../../executeQuery");

const getSubmissionQuery = `
  query GetSubmission{
    submission {
        id
        furtherContent
        viewPrintAnswers
        feedback
        validationErrorInfo {
          totalCount
          errors {
            id
            errorCode
          }
        }
    }
  }
`;

const querySubmission = async (ctx, submissionId) => {
  const result = await executeQuery(getSubmissionQuery, { submissionId }, ctx);
  return result.data.submission;
};

module.exports = {
  getSubmissionQuery,
  querySubmission,
};
