const executeQuery = require("../../executeQuery");

const updateQuestionnaireIntroductionMutation = `
  mutation UpdateQuestionnaireIntroduction($input: UpdateQuestionnaireIntroductionInput!) {
    updateQuestionnaireIntroduction(input: $input) {
      id
      title
      description
      secondaryTitle
      secondaryDescription
      collapsibles {
        id
      }
      legalBasis
      tertiaryTitle
      tertiaryDescription
    }
  }
`;

const updateQuestionnaireIntroduction = async (questionnaire, input) => {
  const result = await executeQuery(
    updateQuestionnaireIntroductionMutation,
    { input },
    { questionnaire }
  );
  return result.data.updateQuestionnaireIntroduction;
};

module.exports = {
  updateQuestionnaireIntroductionMutation,
  updateQuestionnaireIntroduction,
};
