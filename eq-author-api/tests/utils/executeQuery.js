const schema = require("../../schema");
const { graphql } = require("graphql");
const auth = require("./mockAuthPayload");

function executeQuery(query, args = {}, ctx = {}) {
  return graphql(schema, query, {}, { ...ctx, auth }, args);
}

module.exports = executeQuery;
