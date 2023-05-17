const executeQuery = require("../../executeQuery");

const getPrepopSchemaQuery = `
  query GetPrepopSchema {
    prepopSchema {
      id
      schema
    }
}`;

const queryPrepopSchema = async (ctx) => {
  const result = await executeQuery(getPrepopSchemaQuery, ctx);
  return result.data.prepopschema;
};

module.exports = {
  getPrepopSchemaQuery,
  queryPrepopSchema,
};
