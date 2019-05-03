const executeQuery = require("../../executeQuery");

const createQuestionnaireMutation = `
  mutation CreateQuestionnaire($input: CreateQuestionnaireInput!) {
    createQuestionnaire(input: $input) {
      id
      title
      shortTitle
      displayName
      description
      theme
      navigation
      type
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
      introduction {
        id
        title
        collapsibles {
          id
        }
      }
    }
  }
`;

const createQuestionnaire = async (ctx, input) => {
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

module.exports = {
  createQuestionnaireMutation,
  createQuestionnaire,
};
