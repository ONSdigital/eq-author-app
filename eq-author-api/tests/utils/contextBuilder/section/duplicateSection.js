const executeQuery = require("../../executeQuery");

const duplicateSectionMutation = `
  mutation duplicateSection($input: DuplicateSectionInput!) {
    duplicateSection(input: $input) {
      id
    }
  }
`;

const duplicateSection = async (ctx, section) => {
  const input = {
    id: section.id,
    position: section.position + 1,
  };

  const result = await executeQuery(duplicateSectionMutation, { input }, ctx);

  return result.data.duplicateSection;
};

module.exports = {
  duplicateSectionMutation,
  duplicateSection,
};
