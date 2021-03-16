const executeQuery = require("../../executeQuery");

const updateSurveyIdMutation = `
mutation UpdateSurveyId($input: UpdateSurveyIdInput!) {
    updateSurveyId(input: $input) {
      id
      surveyId
    }
  }
`;

const updateSurveyId = async (input, ctx) => {
  const result = await executeQuery(updateSurveyIdMutation, { input }, ctx);
  return result.data.updateSurveyId;
};

module.exports = {
  updateSurveyIdMutation,
  updateSurveyId,
};
