const executeQuery = require("../../executeQuery");

const updateQuestionnaireMutation = `
  mutation UpdateQuestionnaire($input: UpdateQuestionnaireInput!) {
    updateQuestionnaire(input: $input) {
      id
      title
      description
      theme
      navigation
      surveyId
      summary
      shortTitle
      displayName
    }
  }
`;

const updateQuestionnaire = async (ctx, input) => {
  const result = await executeQuery(
    updateQuestionnaireMutation,
    { input },
    ctx
  );
  return result.data.updateQuestionnaire;
};

module.exports = {
  updateQuestionnaireMutation,
  updateQuestionnaire,
};
