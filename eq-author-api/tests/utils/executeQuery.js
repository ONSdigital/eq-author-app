const schema = require("../../schema");
const { graphql } = require("graphql");

function executeQuery(query, args = {}, ctx = {}) {
  return graphql(schema, query, {}, ctx, args);
}

module.exports = executeQuery;