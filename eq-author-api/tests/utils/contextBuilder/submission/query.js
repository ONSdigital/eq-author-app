const executeQuery = require("../../executeQuery");

const getSubmissionQuery = `
  query GetSubmission{
    submission {
        id
        furtherContent
        viewPrintAnswers
        emailConfirmation
        feedback
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
