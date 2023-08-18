const executeQuery = require("../../executeQuery");

const getQuestionnaireQuery = `
  query GetQuestionnaire($input: QueryInput!) {
    questionnaire(input: $input) {
      id
      title
      description
      starred
      navigation
      surveyId
      formType
      eqId
      theme
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
      submission {
        id
        furtherContent
        viewPrintAnswers
        feedback
      }
      prepopSchema {
        id
        surveyId
        data
        dateCreated
        version
      }
      locked
      validationErrorInfo {
        id
        errors {
          id
          errorCode
          field
        }
        totalCount
      }
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
