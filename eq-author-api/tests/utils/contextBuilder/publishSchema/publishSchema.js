const executeQuery = require("../../executeQuery");

const publishSchemaMutation = `
  mutation PublishSchema {
    publishSchema {
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
        publishHistory {
            id
            cirId
            cirVersion
            errorMessage
            formType
            publishDate
            success
            surveyId
        }
    }
  }
`;

const publishSchema = async (ctx) => {
  const result = await executeQuery(publishSchemaMutation, {}, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.publishSchema;
};

module.exports = {
  publishSchemaMutation,
  publishSchema,
};
