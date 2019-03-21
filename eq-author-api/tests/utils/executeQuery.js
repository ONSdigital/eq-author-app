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
  // Required because dynamoose transaction does not update the questionnaireModel's
  // originalItem and so its out of sync which causes us to have to re-query the questionnaire
  if (
    ctx.questionnaire &&
    ctx.questionnaire.originalItem &&
    ctx.questionnaire.updateAt !== ctx.questionnaire.originalItem().updatedAt
  ) {
    ctx.questionnaire.$__.originalItem = JSON.parse(
      JSON.stringify(ctx.questionnaire)
    );
  }

  return response;
}

module.exports = executeQuery;
