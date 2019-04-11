const executeQuery = require("../../../executeQuery");

const updateQuestionPageMutation = `
  mutation UpdateQuestionPage($input: UpdateQuestionPageInput!) {
    updateQuestionPage(input: $input) {
      id
      alias
      title
      description
      descriptionEnabled
      guidance
      guidanceEnabled
      definitionLabel
      definitionContent
      definitionEnabled
      additionalInfoLabel
      additionalInfoContent
      additionalInfoEnabled
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
