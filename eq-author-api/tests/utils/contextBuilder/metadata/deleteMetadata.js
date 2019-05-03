const executeQuery = require("../../executeQuery");

const deleteMetadataMutation = `
  mutation DeleteMetadata($input: DeleteMetadataInput!) {
    deleteMetadata(input: $input) {
      id
    }
  }
`;

const deleteMetadata = async (ctx, id) => {
  const result = await executeQuery(
    deleteMetadataMutation,
    { input: { id } },
    ctx
  );

  return result.data.deleteMetadata;
};

module.exports = {
  deleteMetadataMutation,
  deleteMetadata,
};
