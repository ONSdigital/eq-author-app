const executeQuery = require("../../executeQuery");

const deleteQuestionPageMutation = `
  mutation deleteQuestionPage($input: DeleteQuestionPageInput!) {
    deleteQuestionPage(input: $input) {
      id
    }
  }
`;

const deleteQuestionPage = async (questionnaire, id) => {
  const result = await executeQuery(
    deleteQuestionPageMutation,
    { input: { id } },
    questionnaire
  );
  return result.data.deleteQuestionPage;
};

module.exports = {
  deleteQuestionPageMutation,
  deleteQuestionPage,
};
