const executeQuery = require("../../executeQuery");

const updatePrepopSchemaMutation = `
  mutation UpdatePrepopSchema($input: UpdatePrepopSchemaInput!) {
    updatePrepopSchema(input: $input) {
      id
      schema
    }
`;

const updatePrepopSchema = async (ctx, input) => {
  const result = await executeQuery(
    updatePrepopSchemaMutation,
    { input: input },
    ctx
  );
  return result.data.updatePrepopSchema;
};

module.exports = {
  updatePrepopSchemaMutation,
  updatePrepopSchema,
};
