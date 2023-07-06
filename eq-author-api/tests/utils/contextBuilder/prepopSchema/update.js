const executeQuery = require("../../executeQuery");

const updatePrepopSchemaMutation = `
  mutation UpdatePrepopSchema($input: UpdatePrepopSchemaInput!) {
    updatePrepopSchema(input: $input) {
      id
      surveyId
      data
      dateCreated
      version
    }
  }
`;

const updatePrepopSchema = async (ctx, input) => {
  const result = await executeQuery(updatePrepopSchemaMutation, { input }, ctx);
  console.log("result", result);
  return result.data.updatePrepopSchema;
};

module.exports = {
  updatePrepopSchemaMutation,
  updatePrepopSchema,
};
