const executeQuery = require("../../executeQuery");

const createSectionMutation = `
  mutation CreateSection($input: CreateSectionInput!) {
    createSection(input: $input) {
      id
      title
      position
    }
  }
`;

const createSection = async questionnaire => {
  const input = {
    title: "Test Section",
    questionnaireId: questionnaire.id,
  };

  const result = await executeQuery(
    createSectionMutation,
    { input },
    questionnaire
  );
  return result.data.createSection;
};

module.exports = {
  createSectionMutation,
  createSection,
};
