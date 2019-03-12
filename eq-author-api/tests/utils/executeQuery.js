const schema = require("../../schema");
const { graphql } = require("graphql");
const auth = require("./mockAuthPayload");
const graphqlTools = require("graphql-tools");

const executableSchema = graphqlTools.makeExecutableSchema(schema);

async function executeQuery(query, args = {}, ctx = {}) {
  ctx.auth = auth;
  const response = await graphql(executableSchema, query, {}, ctx, args);
  if (response.errors) {
    throw new Error(`
Running query:
${query}
With input:  
${JSON.stringify(args, null, 2)}
Resulted in:
${response.errors.map(e => e.message).join("\n----\n")}
    `);
  }
  return response;
}

module.exports = executeQuery;
