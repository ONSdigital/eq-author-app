const executeQuery = require("../../executeQuery");

const queryCollapsibleQuery = `
  query GetIntroductionCollapsibles($introductionId: ID!) {
    questionnaireIntroduction(id: $introductionId) {
      id
      collapsibles {
        id
        title
        description
        introduction {
          id
        }
      }
    }
  }
`;

const queryCollapsible = async (ctx, introductionId) => {
  const result = await executeQuery(
    queryCollapsibleQuery,
    { introductionId },
    ctx
  );
  return result.data.questionnaireIntroduction.collapsibles;
};

module.exports = {
  queryCollapsibleQuery,
  queryCollapsible,
};
