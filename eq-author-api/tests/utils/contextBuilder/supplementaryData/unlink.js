const executeQuery = require("../../executeQuery");

const unlinkSupplementaryDataMutation = `
  mutation UnlinkSupplementaryData {
    unlinkSupplementaryData {
      id
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
    }
  }
`;

const unlinkSupplementaryData = async (ctx) => {
  const result = await executeQuery(unlinkSupplementaryDataMutation, {}, ctx);
  return result.data.unlinkSupplementaryData;
};

module.exports = {
  unlinkSupplementaryDataMutation,
  unlinkSupplementaryData,
};
