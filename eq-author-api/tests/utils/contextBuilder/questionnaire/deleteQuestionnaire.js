const executeQuery = require("../../executeQuery");

const deleteQuestionnaireMutation = `
  mutation DeleteQuestionnaire($input: DeleteQuestionnaireInput!) {
    deleteQuestionnaire(input: $input) {
      id
    }
  }
`;

const deleteQuestionnaire = async (ctx, id) => {
  const result = await executeQuery(
    deleteQuestionnaireMutation,
    {
      input: { id },
    },
    ctx
  );
  return result.data.deleteQuestionnaire;
};

module.exports = {
  deleteQuestionnaireMutation,
  deleteQuestionnaire,
};
