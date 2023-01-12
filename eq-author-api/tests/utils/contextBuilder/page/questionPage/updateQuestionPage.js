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
      comments {
        id
        commentText
      }
    }
  }
`;

const updateQuestionPage = async (ctx, input) => {
  const result = await executeQuery(updateQuestionPageMutation, { input }, ctx);
  return result.data.updateQuestionPage;
};

module.exports = {
  updateQuestionPageMutation,
  updateQuestionPage,
};
