const executeQuery = require("../../executeQuery");

const reviewQuestionnaireMutation = `
mutation reviewQuestionnaire($input: ReviewQuestionnaireInput!) {
    reviewQuestionnaire(input: $input) {
      id
      publishStatus
    }
  }
`;

const reviewQuestionnaire = async (
  { questionnaireId, reviewAction, reviewComment },
  ctx
) => {
  const result = await executeQuery(
    reviewQuestionnaireMutation,
    {
      input: { questionnaireId, reviewAction, reviewComment },
    },
    ctx
  );

  return result.data.reviewQuestionnaire;
};

module.exports = {
  reviewQuestionnaireMutation,
  reviewQuestionnaire,
};
