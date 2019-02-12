const executeQuery = require("../../executeQuery");

const duplicateQuestionnaireMutation = `
  mutation duplicateQuestionnaire($input: DuplicateQuestionnaireInput!) {
    duplicateQuestionnaire(input: $input) {
      id
      title
      description
      navigation
      legalBasis
      theme
      metadata {
        id
      }
      sections {
        id
        pages {
          id
          ... on QuestionPage {
            answers {
              id
            }
          }
        }
      }
    }
  }
`;

const duplicateQuestionnaire = async questionnaire => {
  const input = {
    id: questionnaire.id,
  };

  const result = await executeQuery(
    duplicateQuestionnaireMutation,
    { input },
    {}
  );
  return result.data.duplicateQuestionnaire;
};

module.exports = {
  duplicateQuestionnaireMutation,
  duplicateQuestionnaire,
};
