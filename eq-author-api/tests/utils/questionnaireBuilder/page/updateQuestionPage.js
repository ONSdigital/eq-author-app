const executeQuery = require("../../executeQuery");

const updateQuestionPageMutation = `
  mutation UpdateQuestionPage($input: UpdateQuestionPageInput!) {
    updateQuestionPage(input: $input) {
      id
      alias
      title
      description
      guidance
      definitionLabel
      definitionContent
      additionalInfoLabel
      additionalInfoContent
    }
  }
`;

const updateQuestionPage = async (questionnaire, input) => {
  const result = await executeQuery(
    updateQuestionPageMutation,
    { input },
    { questionnaire }
  );
  return result.data.updateQuestionPage;
};

module.exports = {
  updateQuestionPageMutation,
  updateQuestionPage,
};
