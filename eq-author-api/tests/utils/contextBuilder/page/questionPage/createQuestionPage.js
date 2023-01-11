const executeQuery = require("../../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createQuestionPageMutation = `
  mutation CreateQuestionPage($input: CreateQuestionPageInput!) {
    createQuestionPage(input: $input) {
      id
      alias
      title
      description
      descriptionEnabled
      pageDescription
      guidance
      guidanceEnabled
      definitionLabel
      definitionContent
      definitionEnabled
      additionalInfoLabel
      additionalInfoContent
      additionalInfoEnabled
      position
    }
  }
`;

const createQuestionPage = async (ctx, input) => {
  const result = await executeQuery(
    createQuestionPageMutation,
    {
      input: filter(
        gql`
          {
            title
            alias
            description
            descriptionEnabled
            pageDescription
            guidance
            guidanceEnabled
            folderId
            position
            definitionLabel
            definitionContent
            definitionEnabled
            additionalInfoLabel
            additionalInfoContent
            additionalInfoEnabled
          }
        `,
        input
      ),
    },
    ctx
  );
  return result.data.createQuestionPage;
};

module.exports = {
  createQuestionPageMutation,
  createQuestionPage,
};
