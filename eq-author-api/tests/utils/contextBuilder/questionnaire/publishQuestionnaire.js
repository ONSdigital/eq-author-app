const executeQuery = require("../../executeQuery");

const publishQuestionnaireQuery = `
query triggerPublish($input: ID!) {
    triggerPublish(questionnaireId: $input) {
      id
      launchUrl
    }
  }
`;

const publishQuestionnaire = async questionnaireId => {
  const result = await executeQuery(publishQuestionnaireQuery, {
    input: questionnaireId,
  });

  return result.data.triggerPublish;
};

module.exports = {
  publishQuestionnaireQuery,
  publishQuestionnaire,
};
