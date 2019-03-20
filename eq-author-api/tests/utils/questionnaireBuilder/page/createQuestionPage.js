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
      guidance
      definitionLabel
      definitionContent
      additionalInfoLabel
      additionalInfoContent
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
            guidance
            sectionId
            position
            definitionLabel
            definitionContent
            additionalInfoLabel
            additionalInfoContent
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
