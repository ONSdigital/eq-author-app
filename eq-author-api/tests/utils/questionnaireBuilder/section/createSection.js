const executeQuery = require("../../executeQuery");
const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const createSectionMutation = `
  mutation CreateSection($input: CreateSectionInput!) {
    createSection(input: $input) {
      id
      title
      alias
      displayName
      position
      pages {
        id
      }
      questionnaire {
        id
      }
      introduction {
        id
      }
      availablePipingAnswers {
        id
      }
      availablePipingMetadata {
        id
      }
    }
  }
`;

const createSection = async (questionnaire, input) => {
  const result = await executeQuery(
    createSectionMutation,
    {
      input: filter(
        gql`
          {
            title
            alias
            questionnaireId
            position
          }
        `,
        input
      ),
    },
    questionnaire
  );
  return result.data.createSection;
};

module.exports = {
  createSectionMutation,
  createSection,
};
