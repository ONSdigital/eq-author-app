const executeQuery = require("../../executeQuery");

const duplicateSectionMutation = `
  mutation duplicateSection($input: DuplicateSectionInput!) {
    duplicateSection(input: $input) {
      id
      title
      position
      pages {
        id
        ... on QuestionPage {
          answers {
            id
          }
        }
      }
    }
  }
`;

const duplicateSection = async (questionnaire, section) => {
  const input = {
    id: section.id,
    position: section.position + 1,
  };

  const result = await executeQuery(
    duplicateSectionMutation,
    { input },
    questionnaire
  );

  return result.data.duplicateSection;
};

module.exports = {
  duplicateSectionMutation,
  duplicateSection,
};
