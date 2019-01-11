const executeQuery = require("../../executeQuery");

const deleteQuestionnaireMutation = `
  mutation DeleteQuestionnaire($input: DeleteQuestionnaireInput!) {
    deleteQuestionnaire(input: $input) {
      id
    }
  }
`;

const deleteQuestionnaire = async id => {
  const result = await executeQuery(deleteQuestionnaireMutation, {
    input: { id },
  });
  return result.data.deleteQuestionnaire;
};

module.exports = {
  deleteQuestionnaireMutation,
  deleteQuestionnaire,
};
