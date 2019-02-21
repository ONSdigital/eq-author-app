const executeQuery = require("../../executeQuery");

const updateSectionMutation = `
  mutation UpdateSection($input: UpdateSectionInput!) {
    updateSection(input: $input) {
     id
      title
      alias
      displayName
      position
      pages {
        ... on QuestionPage {
          id
        }
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

const updateSection = async (questionnaire, input) => {
  const result = await executeQuery(
    updateSectionMutation,
    { input },
    { questionnaire }
  );
  return result.data.updateSection;
};

module.exports = {
  updateSectionMutation,
  updateSection,
};
