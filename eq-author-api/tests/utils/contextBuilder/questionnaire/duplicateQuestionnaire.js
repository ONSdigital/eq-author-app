const executeQuery = require("../../executeQuery");

const duplicateQuestionnaireMutation = `
  mutation duplicateQuestionnaire($input: DuplicateQuestionnaireInput!) {
    duplicateQuestionnaire(input: $input) {
      id
      title
      shortTitle
      displayName
      description
      theme
      navigation
      surveyId
      createdAt
      sections {
        id
      }
      createdBy {
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

const duplicateQuestionnaire = async (ctx) => {
  const input = {
    id: ctx.questionnaire.id,
  };

  const result = await executeQuery(
    duplicateQuestionnaireMutation,
    { input },
    ctx
  );
  return result.data.duplicateQuestionnaire;
};

module.exports = {
  duplicateQuestionnaireMutation,
  duplicateQuestionnaire,
};
