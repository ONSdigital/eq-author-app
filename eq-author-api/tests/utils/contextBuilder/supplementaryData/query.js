const executeQuery = require("../../executeQuery");

const getSupplementaryDataQuery = `
  query GetSupplementaryData {
    supplementaryData {
      id
      surveyId
      sdsDateCreated
      sdsVersion
      sdsGuid
      data  
    }
}`;

const querySupplementaryData = async (ctx) => {
  const result = await executeQuery(getSupplementaryDataQuery, {}, ctx);
  return result.data.supplementaryData;
};

module.exports = {
  getSupplementaryDataQuery,
  querySupplementaryData,
};
