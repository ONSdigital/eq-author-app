const executeQuery = require("../../executeQuery");

const duplicateAndRenameQuestionnaireMutation = `
  mutation duplicateAndRenameQuestionnaire($input: DuplicateAndRenameQuestionnaireInput!) {
    duplicateAndRenameQuestionnaire(input: $input) {
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

const duplicateAndRenameQuestionnaire = async (
  context,
  inputOverrides = {}
) => {
  const mutationInput = {
    id: context.questionnaire.id,
    ...inputOverrides,
  };

  const queryResult = await executeQuery(
    duplicateAndRenameQuestionnaireMutation,
    { input: mutationInput },
    context
  );

  if (queryResult.errors) {
    throw new Error(queryResult.errors[0]);
  }

  return queryResult.data.duplicateAndRenameQuestionnaire;
};

module.exports = {
  duplicateAndRenameQuestionnaire,
};

