const executeQuery = require("../../executeQuery");

const createQuestionPageMutation = `
  mutation CreateQuestionPage($input: CreateQuestionPageInput!) {
    createQuestionPage(input: $input) {
      id
      title
      position
      guidance
      answers {
        id
        label 
      }
      confirmation {
        id
        title
      }
    }
  }
`;

const createQuestionPage = async (questionnaire, sectionId) => {
  const input = {
    title: "Test QuestionPage",
    sectionId,
  };

  const result = await executeQuery(
    createQuestionPageMutation,
    { input },
    questionnaire
  );
  return result.data.createQuestionPage;
};

module.exports = {
  createQuestionPageMutation,
  createQuestionPage,
};
