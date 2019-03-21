const executeQuery = require("../../executeQuery");
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

const createQuestionPage = async (questionnaire, input) => {
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
            guidance
            guidanceEnabled
            sectionId
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
    { questionnaire }
  );
  return result.data.createQuestionPage;
};

module.exports = {
  createQuestionPageMutation,
  createQuestionPage,
};
