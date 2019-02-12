const executeQuery = require("../../executeQuery");

const createSectionIntroductionMutation = `
  mutation CreateSectionIntroduction($input: CreateSectionIntroductionInput!) {
    createSectionIntroduction(input: $input) {
       id
      introductionTitle
      introductionContent
      section {
        id
      }
    }
  }
`;

const createSectionIntroduction = async (questionnaire, input) => {
  const result = await executeQuery(
    createSectionIntroductionMutation,
    { input },
    questionnaire
  );
  return result.data.createSectionIntroduction;
};

module.exports = {
  createSectionIntroductionMutation,
  createSectionIntroduction,
};
