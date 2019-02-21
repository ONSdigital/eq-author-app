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
    { questionnaire }
  );

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.createMetadata;
};

module.exports = {
  createMetadataMutation,
  createMetadata,
};
