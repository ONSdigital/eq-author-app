const executeQuery = require("../../executeQuery");

const unlinkPrepopSchemaMutation = `
  mutation UnlinkPrepopSchema {
    unlinkPrepopSchema {
      id
      prepopSchema {
        id
        surveyId
        schema        
      }
    }
  }
`;

const unlinkPrepopSchema = async (ctx) => {
  const result = await executeQuery(unlinkPrepopSchemaMutation, {}, ctx);
  return result.data.unlinkPrepopSchema;
};

module.exports = {
  unlinkPrepopSchemaMutation,
  unlinkPrepopSchema,
};
