const executeQuery = require("../../executeQuery");

const updatePageMutation = `
  mutation UpdatePage($input: UpdatePageInput!) {
    updatePage(input: $input) {
        id
        alias
        title
        ... on QuestionPage {
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
            pageDescription
        }
    }
  }
`;

const updatePage = async (ctx, input) => {
  const result = await executeQuery(
    updatePageMutation,
    {
      input,
    },
    ctx
  );
  return result.data.updatePage;
};

module.exports = {
  updatePageMutation,
  updatePage,
};
