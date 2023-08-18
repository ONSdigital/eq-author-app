const executeQuery = require("../../executeQuery");

const updateSubmissionMutation = `
mutation UpdateSubmission($input: UpdateSubmissionInput!) {
    updateSubmission(input: $input) {
      id
      furtherContent
      viewPrintAnswers
      feedback
    }
  }  
`;

const updateSubmission = async (input, ctx) => {
  const result = await executeQuery(updateSubmissionMutation, { input }, ctx);
  return result.data.updateSubmission;
};

module.exports = {
  updateSubmissionMutation,
  updateSubmission,
};
