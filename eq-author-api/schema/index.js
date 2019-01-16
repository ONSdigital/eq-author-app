const graphqlTools = require("graphql-tools");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

/**
 * This is where all the GraphQL schema types will be defined.
 */
module.exports = graphqlTools.makeExecutableSchema({
  typeDefs,
  resolvers,
});
