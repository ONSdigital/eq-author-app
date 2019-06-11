const schema = require("../../schema");
const { graphql } = require("graphql");

const graphqlTools = require("graphql-tools");

const { getQuestionnaire } = require("../../utils/datastore");

const executableSchema = graphqlTools.makeExecutableSchema(schema);

async function executeQuery(query, args = {}, ctx = {}) {
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
  if (ctx.questionnaire) {
    ctx.questionnaire = await getQuestionnaire(ctx.questionnaire.id);
  }

  return response;
}

module.exports = executeQuery;
