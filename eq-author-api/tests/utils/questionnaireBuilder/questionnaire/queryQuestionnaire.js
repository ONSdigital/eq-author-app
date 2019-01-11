const executeQuery = require("../../executeQuery");

const getQuestionnaireQuery = `
  query GetQuestionnaire($input: QueryInput!) {
    questionnaire(input: $input) {
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

const queryQuestionnaire = async questionnaire => {
  const result = await executeQuery(
    getQuestionnaireQuery,
    { input: {} },
    { questionnaire }
  );
  return result.data.questionnaire;
};

module.exports = {
  getQuestionnaireQuery,
  queryQuestionnaire,
};
