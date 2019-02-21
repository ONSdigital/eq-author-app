const executeQuery = require("../../executeQuery");

const getMetadataQuery = `
  query GetMetadata ($input: QueryInput!) {
    questionnaire(input: $input) {
      metadata {
        id
        key
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

const queryMetadata = async questionnaire => {
  const result = await executeQuery(
    getMetadataQuery,
    { input: {} },
    questionnaire
  );
  return result.data.questionnaire.metadata;
};

module.exports = {
  getMetadataQuery,
  queryMetadata,
};
