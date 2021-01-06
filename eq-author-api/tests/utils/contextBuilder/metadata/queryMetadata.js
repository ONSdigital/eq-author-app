const executeQuery = require("../../executeQuery");

const getMetadataQuery = `
  query GetMetadata ($input: QueryInput!) {
    questionnaire(input: $input) {
      metadata {
        id
        key
        fallbackKey
        alias
        type
        dateValue
        regionValue
        languageValue
        textValue
        displayName
      }
    }
  }
`;

const queryMetadata = async ctx => {
  const result = await executeQuery(getMetadataQuery, { input: {} }, ctx);
  return result.data.questionnaire.metadata;
};

module.exports = {
  getMetadataQuery,
  queryMetadata,
};
