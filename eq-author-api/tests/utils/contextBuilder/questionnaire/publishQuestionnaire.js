const executeQuery = require("../../executeQuery");

const publishQuestionnaireQuery = `
query triggerPublish($input: ID!) {
    triggerPublish(questionnaireId: $input) {
      id
      launchUrl
    }
  }
`;

const publishQuestionnaire = async (questionnaireId, ctx) => {
  const result = await executeQuery(
    publishQuestionnaireQuery,
    {
      input: questionnaireId,
    },
    ctx
  );

  return result.data.triggerPublish;
};

module.exports = {
  publishQuestionnaireQuery,
  publishQuestionnaire,
};
