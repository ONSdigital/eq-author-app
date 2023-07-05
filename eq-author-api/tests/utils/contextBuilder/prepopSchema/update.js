const executeQuery = require("../../executeQuery");

const updatePrepopSchemaMutation = `
  mutation UpdatePrepopSchema($input: UpdatePrepopSchemaInput!) {
    updatePrepopSchema(input: $input) {
      id
      surveyId
      schema
      dateCreated
      version
    }
  }
`;

const updatePrepopSchema = async (ctx, input) => {
  const result = await executeQuery(updatePrepopSchemaMutation, { input }, ctx);
  return result.data.updatePrepopSchema;
};

module.exports = {
  updatePrepopSchemaMutation,
  updatePrepopSchema,
};
