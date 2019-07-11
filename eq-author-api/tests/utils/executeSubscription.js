const graphqlTools = require("graphql-tools");
const { subscribe } = require("graphql/subscription");

const schema = require("../../schema");

const executableSchema = graphqlTools.makeExecutableSchema(schema);

module.exports = (query, args = {}, context = {}) =>
  subscribe({
    schema: executableSchema,
    document: query,
    contextValue: context,
    variableValues: args,
  });
