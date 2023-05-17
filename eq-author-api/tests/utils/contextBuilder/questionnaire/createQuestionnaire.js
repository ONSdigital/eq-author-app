const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");

const executeQuery = require("../../executeQuery");

const createQuestionnaireMutation = `
  mutation CreateQuestionnaire($input: CreateQuestionnaireInput!) {
    createQuestionnaire(input: $input) {
      id
      title
      shortTitle
      displayName
      description
      navigation
      type
      surveyId
      formType
      eqId
      theme
      legalBasis
      createdAt
      createdBy {
        id
      }
      sections {
        id
        folders {
          id
          pages {
            id
          }
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
      submission {
        id
        furtherContent
        viewPrintAnswers
        emailConfirmation
        feedback
      }
      prepopschema {
        id
        schema
      }
    }
  }
`;

const createQuestionnaire = async (ctx, input) => {
  const result = await executeQuery(
    createQuestionnaireMutation,
    {
      input: filter(
        gql`
          {
            title
            description
            navigation
            surveyId
            formType
            eqId
            theme
            legalBasis
            summary
            type
            shortTitle
            isPublic
          }
        `,
        input
      ),
    },
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
