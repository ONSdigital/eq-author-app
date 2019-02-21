const schema = require("../../schema");
const { graphql } = require("graphql");
const auth = require("./mockAuthPayload");
const graphqlTools = require("graphql-tools");

const executableSchema = graphqlTools.makeExecutableSchema(schema);

function executeQuery(query, args = {}, ctx = {}) {
  let context = ctx;
  if (ctx.id) {
    context = { questionnaire: ctx };
  }

  return graphql(executableSchema, query, {}, { auth, ...context }, args);
}

module.exports = executeQuery;
