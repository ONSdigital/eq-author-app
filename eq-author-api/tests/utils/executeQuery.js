const schema = require("../../schema");
const { graphql } = require("graphql");
const auth = require("./mockAuthPayload");

const executeQuery = (query, args = {}, questionnaire = {}) => {
  return graphql(schema, query, {}, { questionnaire, auth }, args).then(
    result => {
      if (result.errors) {
        throw new Error(result.errors[0]);
      } else {
        return result;
      }
    }
  );
};

module.exports = executeQuery;
