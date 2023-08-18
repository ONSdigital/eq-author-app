const executeQuery = require("../../executeQuery");

const getSupplementaryDataQuery = `
  query GetSupplementaryData {
    supplementaryData {
      id
      surveyId
      sdsDateCreated
      sdsVersion
      sdsGuid
      data {
        id
        listName
        schemaFields {
          id
          type
          identifier
          selector
          example
          exampleArray
          description
        }
      } 
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
