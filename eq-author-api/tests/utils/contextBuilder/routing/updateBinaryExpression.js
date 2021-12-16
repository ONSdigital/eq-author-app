const executeQuery = require("../../executeQuery");

const updateBinaryExpressionMutation = `
      mutation updateBinaryExpression2($input: UpdateBinaryExpression2Input!) {
        updateBinaryExpression2(input: $input) {    
          ...on BinaryExpression2 {
                    id
          left {
            ...on Answer{
              id 
             }
          }
          condition 
          secondaryCondition 
          }      

        }
      }`;

const updateBinaryExpression = async (ctx, input) => {
  const result = await executeQuery(
    updateBinaryExpressionMutation,
    {
      input,
    },
    ctx
  );
  return result.data.updateBinaryExpression2;
};

module.exports = {
  updateBinaryExpressionMutation,
  updateBinaryExpression,
};
