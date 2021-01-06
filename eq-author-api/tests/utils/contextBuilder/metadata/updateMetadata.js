const executeQuery = require("../../executeQuery");

const updateMetadataMutation = `
  mutation UpdateMetadata($input: UpdateMetadataInput!) {
    updateMetadata(input: $input) {
      id
      key
      fallbackKey,
      alias
      type
      dateValue
      regionValue
      languageValue
      textValue
      displayName
    }
  }
`;

const updateMetadata = async (ctx, input) => {
  const result = await executeQuery(updateMetadataMutation, { input }, ctx);

  return result.data.updateMetadata;
};

module.exports = {
  updateMetadataMutation,
  updateMetadata,
};
