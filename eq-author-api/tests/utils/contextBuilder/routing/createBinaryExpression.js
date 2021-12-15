const executeQuery = require("../../executeQuery");

const createBinaryExpressionMutation = `
      mutation createBinaryExpression2($input: CreateBinaryExpression2Input!) {
        createBinaryExpression2(input: $input) {    
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

const createBinaryExpression = async (ctx, expressionGroup) => {
  const input = {
    expressionGroupId: expressionGroup.id,
  };
  const result = await executeQuery(
    createBinaryExpressionMutation,
    {
      input,
    },
    ctx
  );
  return result.data.createBinaryExpression2;
};

module.exports = {
  createBinaryExpressionMutation,
  createBinaryExpression,
};
