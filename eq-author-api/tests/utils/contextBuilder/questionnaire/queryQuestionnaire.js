const executeQuery = require("../../executeQuery");

const getQuestionnaireQuery = `
  query GetQuestionnaire($input: QueryInput!) {
    questionnaire(input: $input) {
      id
      title
      description
      theme
      starred
      navigation
      surveyId
      createdAt
      shortTitle
      displayName
      createdBy {
        displayName
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
      permission
      editors {
        id
      }
      totalErrorCount
      publishStatus
      previewTheme
      themes {
        id
        enabled
        shortName
        legalBasisCode
        eqId
        formType
      }
      locked
    }
  }
`;

const queryQuestionnaire = async (ctx) => {
  const result = await executeQuery(getQuestionnaireQuery, { input: {} }, ctx);
  if (ctx.questionnaireValidationErrors) {
    return {
      ...result.data.questionnaire,
      validationErrorInfo: {
        errors: ctx.questionnaireValidationErrors.errors,
        totalCount: ctx.questionnaireValidationErrors.errors.length,
      },
    };
  }

  return result.data.questionnaire;
};

module.exports = {
  getQuestionnaireQuery,
  queryQuestionnaire,
};
