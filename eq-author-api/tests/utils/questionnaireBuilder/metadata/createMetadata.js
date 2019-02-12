const executeQuery = require("../../executeQuery");

const createMetadataMutation = `
  mutation CreateMetadata($input: CreateMetadataInput!) {
    createMetadata(input: $input) {
      id
    }
  }
`;

const createMetadata = async (questionnaire, input) => {
  const result = await executeQuery(
    createMetadataMutation,
    { input },
    questionnaire
  );

  return result.data.createMetadata;
};

module.exports = {
  createMetadataMutation,
  createMetadata,
};
