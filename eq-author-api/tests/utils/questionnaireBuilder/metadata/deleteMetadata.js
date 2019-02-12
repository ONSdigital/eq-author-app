const executeQuery = require("../../executeQuery");

const deleteMetadataMutation = `
  mutation DeleteMetadata($input: DeleteMetadataInput!) {
    deleteMetadata(input: $input) {
      id
    }
  }
`;

const deleteMetadata = async (questionnaire, id) => {
  const result = await executeQuery(
    deleteMetadataMutation,
    { input: { id } },
    questionnaire
  );

  return result.data.deleteMetadata;
};

module.exports = {
  deleteMetadataMutation,
  deleteMetadata,
};
