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
  { questionnaireId, surveyId, variants },
  ctx
) => {
  const result = await executeQuery(
    publishQuestionnaireMutation,
    {
      input: { questionnaireId, surveyId, variants },
    },
    ctx
  );

  return result.data.triggerPublish;
};

module.exports = {
  publishQuestionnaireMutation,
  publishQuestionnaire,
};
