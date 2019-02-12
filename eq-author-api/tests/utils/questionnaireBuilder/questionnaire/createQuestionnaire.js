const executeQuery = require("../../executeQuery");

const createQuestionnaireMutation = `
  mutation CreateQuestionnaire($input: CreateQuestionnaireInput!) {
    createQuestionnaire(input: $input) {
      id
      title
      description
      theme
      legalBasis
      navigation
      surveyId
      createdAt
      createdBy {
        id
      }
      sections {
        id
        pages {
          id
        }
      }
      summary
      questionnaireInfo {
        totalSectionCount
      }
      metadata {
        id
      }
    }
  }
`;

const createQuestionnaire = async input => {
  const result = await executeQuery(createQuestionnaireMutation, { input }, {});
  return result.data.createQuestionnaire;
};

module.exports = {
  createQuestionnaireMutation,
  createQuestionnaire,
};
