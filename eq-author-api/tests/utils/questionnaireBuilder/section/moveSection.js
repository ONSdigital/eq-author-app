const executeQuery = require("../../executeQuery");

const moveSectionMutation = `
  mutation MoveSection($input: MoveSectionInput!) {
    moveSection(input: $input) {
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
      availablePipingAnswers {
        id
      }
      availablePipingMetadata {
        id
      }
    }
  }
`;

const moveSection = async (questionnaire, input) => {
  const result = await executeQuery(
    moveSectionMutation,
    { input },
    { questionnaire }
  );

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.moveSection;
};

module.exports = {
  moveSectionMutation,
  moveSection,
};
