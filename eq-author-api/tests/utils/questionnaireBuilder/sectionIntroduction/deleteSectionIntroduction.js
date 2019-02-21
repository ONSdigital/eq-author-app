const executeQuery = require("../../executeQuery");

const deleteSectionIntroductionMutation = `
  mutation DeleteSectionIntroduction($input: DeleteSectionIntroductionInput!) {
    deleteSectionIntroduction(input: $input) {
      id
    }
  }
`;

const deleteSectionIntroduction = async (questionnaire, sectionId) => {
  const result = await executeQuery(
    deleteSectionIntroductionMutation,
    { input: { sectionId } },
    questionnaire
  );
  return result.data.deleteSectionIntroduction;
};

module.exports = {
  deleteSectionIntroductionMutation,
  deleteSectionIntroduction,
};
