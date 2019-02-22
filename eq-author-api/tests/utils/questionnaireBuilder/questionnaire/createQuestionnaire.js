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

const createQuestionnaire = async (input, ctx = {}) => {
  const result = await executeQuery(
    createQuestionnaireMutation,
    { input },
    ctx
  );

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.createQuestionnaire;
};

const createQuestionnaireReturningPersisted = async input => {
  const ctx = {};
  await createQuestionnaire(input, ctx);
  return ctx.questionnaire;
};

module.exports = {
  createQuestionnaireMutation,
  createQuestionnaire,
  createQuestionnaireReturningPersisted,
};
