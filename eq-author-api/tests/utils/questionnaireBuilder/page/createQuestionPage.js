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
            description
            sectionId
            position
          }
        `,
        input
      ),
    },
    questionnaire
  );
  return result.data.createQuestionPage;
};

module.exports = {
  createQuestionPageMutation,
  createQuestionPage,
};
