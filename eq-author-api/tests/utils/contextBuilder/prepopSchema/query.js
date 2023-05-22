const executeQuery = require("../../executeQuery");

const getPrepopSchemaQuery = `
  query GetPrepopSchema {
    prepopSchema {
      id
      schema
    }
}`;

const queryPrepopSchema = async (ctx) => {
  const result = await executeQuery(getPrepopSchemaQuery, {}, ctx);
  return result.data.prepopSchema;
};

module.exports = {
  getPrepopSchemaQuery,
  queryPrepopSchema,
};
