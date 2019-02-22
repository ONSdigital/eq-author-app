const schema = require("../../schema");
const { graphql } = require("graphql");
const auth = require("./mockAuthPayload");
const graphqlTools = require("graphql-tools");

const executableSchema = graphqlTools.makeExecutableSchema(schema);

function executeQuery(query, args = {}, ctx = {}) {
  ctx.auth = auth;
  return graphql(executableSchema, query, {}, ctx, args);
}

module.exports = executeQuery;
