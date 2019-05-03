const executeQuery = require("../../executeQuery");

const deleteSectionMutation = `
  mutation deleteSection($input: DeleteSectionInput!) {
    deleteSection(input: $input) {
      id
    }
  }
`;

const deleteSection = async (ctx, id) => {
  const result = await executeQuery(
    deleteSectionMutation,
    { input: { id } },
    ctx
  );
  return result.data.deleteSection;
};

module.exports = {
  deleteSectionMutation,
  deleteSection,
};
