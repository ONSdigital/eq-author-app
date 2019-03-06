const executeQuery = require("../../executeQuery");

const duplicateQuestionnaireMutation = `
  mutation duplicateQuestionnaire($input: DuplicateQuestionnaireInput!) {
    duplicateQuestionnaire(input: $input) {
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

const duplicateQuestionnaire = async questionnaire => {
  const input = {
    id: questionnaire.id,
  };

  const result = await executeQuery(duplicateQuestionnaireMutation, { input });
  return result.data.duplicateQuestionnaire;
};

module.exports = {
  duplicateQuestionnaireMutation,
  duplicateQuestionnaire,
};
