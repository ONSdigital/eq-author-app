const executeQuery = require("../../executeQuery");

const getMetadataQuery = `
  query GetMetadata {
    questionnaire {
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
  const result = await executeQuery(getMetadataQuery, {}, questionnaire);
  return result.data.questionnaire.metadata;
};

module.exports = {
  getMetadataQuery,
  queryMetadata,
};
