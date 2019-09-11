const executeQuery = require("../../executeQuery");

const publishQuestionnaireQuery = `
query triggerPublish($input: PublishQuestionnaireInput!) {
    triggerPublish(input: $input) {
      id
      launchUrl
    }
  }
`;

const publishQuestionnaire = async (
  { questionnaireId, surveyId, formType },
  ctx
) => {
  const result = await executeQuery(
    publishQuestionnaireQuery,
    {
      input: { questionnaireId, surveyId, formType },
    },
    ctx
  );

  return result.data.triggerPublish;
};

module.exports = {
  publishQuestionnaireQuery,
  publishQuestionnaire,
};
