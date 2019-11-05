const executeQuery = require("../../executeQuery");

const reviewQuestionnaireMutation = `
mutation reviewQuestionnaire($input: ReviewQuestionnaireInput!) {
    reviewQuestionnaire(input: $input) {
      id
      publishStatus
    }
  }
`;

const reviewQuestionnaire = async ({ questionnaireId, reviewAction }, ctx) => {
  const result = await executeQuery(
    reviewQuestionnaireMutation,
    {
      input: { questionnaireId, reviewAction },
    },
    ctx
  );

  return result.data.reviewQuestionnaire;
};

module.exports = {
  reviewQuestionnaireMutation,
  reviewQuestionnaire,
};
