const executeQuery = require("../../executeQuery");

const getQuestionConfirmationQuery = `
  query GetQuestionConfirmation($id: ID!) {
    questionConfirmation(id: $id) {
      id
      title
      positive {
        label
        description
      }
      negative {
        label
        description
      }
      page {
        id
      }
      availablePipingAnswers {
        id
      }
      availablePipingMetadata {
        id
      }
    }
  }
`;

const queryQuestionConfirmation = async (questionnaire, id) => {
  const result = await executeQuery(
    getQuestionConfirmationQuery,
    { id },
    questionnaire
  );

  return result.data.questionConfirmation;
};

module.exports = {
  getQuestionConfirmationQuery,
  queryQuestionConfirmation,
};
