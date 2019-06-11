const executeQuery = require("../../executeQuery");

const updateExpressionGroupMutation = `
      mutation updateExpressionGroup2($input: UpdateExpressionGroup2Input!) {
        updateExpressionGroup2(input: $input) {  
          id  
        }
      }`;

const updateExpressionGroup = async (ctx, input) => {
  const result = await executeQuery(
    updateExpressionGroupMutation,
    {
      input,
    },
    ctx
  );
  return result.data.updateExpressionGroup2;
};

module.exports = {
  updateExpressionGroupMutation,
  updateExpressionGroup,
};
