const executeQuery = require("../../executeQuery");

const deleteQuestionnaireMutation = `
  mutation DeleteQuestionnaire($input: DeleteQuestionnaireInput!) {
    deleteQuestionnaire(input: $input) {
      id
    }
  }
`;

const deleteQuestionnaire = async id => {
  const input = {
    id,
  };
  const result = await executeQuery(deleteQuestionnaireMutation, { input });
  return result.data.deleteQuestionnaire;
};

module.exports = {
  deleteQuestionnaireMutation,
  deleteQuestionnaire,
};
