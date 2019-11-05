const executeQuery = require("../../executeQuery");

const publishQuestionnaireMutation = `
mutation triggerPublish($input: PublishQuestionnaireInput!) {
    triggerPublish(input: $input) {
      id
      publishStatus
    }
  }
`;

const publishQuestionnaire = async (
  { questionnaireId, surveyId, formType },
  ctx
) => {
  const result = await executeQuery(
    publishQuestionnaireMutation,
    {
      input: { questionnaireId, surveyId, formType },
    },
    ctx
  );

  return result.data.triggerPublish;
};

module.exports = {
  publishQuestionnaireMutation,
  publishQuestionnaire,
};
