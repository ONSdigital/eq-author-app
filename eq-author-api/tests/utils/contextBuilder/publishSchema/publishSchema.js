const executeQuery = require("../../executeQuery");

const publishSchemaMutation = `
  mutation PublishSchema {
    publishSchema {
        id
        cirId
        cirVersion
        errorMessage
        displayErrorMessage
        formType
        publishDate
        success
        surveyId
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
