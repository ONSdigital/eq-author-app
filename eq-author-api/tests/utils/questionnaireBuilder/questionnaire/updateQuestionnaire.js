const executeQuery = require("../../executeQuery");

const updateQuestionnaireMutation = `
  mutation UpdateQuestionnaire($input: UpdateQuestionnaireInput!) {
    updateQuestionnaire(input: $input) {
      id
      title
      description
      theme
      legalBasis
      navigation
      surveyId
      summary
    }
  }
`;

const updateQuestionnaire = async (questionnaire, input) => {
  const result = await executeQuery(
    updateQuestionnaireMutation,
    { input },
    questionnaire
  );
  return result.data.updateQuestionnaire;
};

module.exports = {
  updateQuestionnaireMutation,
  updateQuestionnaire,
};
