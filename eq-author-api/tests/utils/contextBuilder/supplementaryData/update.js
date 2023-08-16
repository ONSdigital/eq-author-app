const executeQuery = require("../../executeQuery");

const updateSupplementaryDataMutation = `
  mutation UpdateSupplementaryData($input: UpdateSupplementaryDataInput!) {
    updateSupplementaryData(input: $input) {
      id
      surveyId
      data
      sdsDateCreated
      sdsVersion
      sdsGuid
    }
  }
`;

const updateSupplementaryData = async (ctx, input) => {
  const result = await executeQuery(
    updateSupplementaryDataMutation,
    { input },
    ctx
  );
  return result.data.updateSupplementaryData;
};

module.exports = {
  updateSupplementaryDataMutation,
  updateSupplementaryData,
};
