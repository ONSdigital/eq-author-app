const executeQuery = require("../../executeQuery");

const getHistoryQuery = `
query History($input: QueryInput!) {
    history(input: $input) {
      id
      publishStatus
      questionnaireTitle
      bodyText
      user {
        id
        email
        name
        displayName
      }
      time
      type
    }
  }
`;

const queryHistory = async (ctx) => {
  const result = await executeQuery(
    getHistoryQuery,
    { input: { questionnaireId: ctx.questionnaire.id } },
    ctx
  );
  return result.data.history;
};

module.exports = {
  getHistoryQuery,
  queryHistory,
};
