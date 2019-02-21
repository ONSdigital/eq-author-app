const executeQuery = require("../../executeQuery");

const updateMetadataMutation = `
  mutation UpdateMetadata($input: UpdateMetadataInput!) {
    updateMetadata(input: $input) {
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
`;

const updateMetadata = async (questionnaire, input) => {
  const result = await executeQuery(
    updateMetadataMutation,
    { input },
    questionnaire
  );

  return result.data.updateMetadata;
};

module.exports = {
  updateMetadataMutation,
  updateMetadata,
};
