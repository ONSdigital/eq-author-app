const executeQuery = require("../../executeQuery");

const deleteSectionMutation = `
  mutation deleteSection($input: DeleteSectionInput!) {
    deleteSection(input: $input) {
      id
    }
  }
`;

const deleteSection = async (questionnaire, id) => {
  const result = await executeQuery(
    deleteSectionMutation,
    { input: { id } },
    { questionnaire }
  );
  return result.data.deleteSection;
};

module.exports = {
  deleteSectionMutation,
  deleteSection,
};
