const executeQuery = require("../../executeQuery");

const deleteSectionMutation = `
  mutation deleteSection($input: DeleteSectionInput!) {
    deleteSection(input: $input) {
      id
    }
  }
`;

const deleteSection = async (questionnaire, section) => {
  const input = {
    id: section.id,
  };

  const result = await executeQuery(
    deleteSectionMutation,
    { input },
    questionnaire
  );
  return result.data.deleteSection;
};

module.exports = {
  deleteSectionMutation,
  deleteSection,
};
