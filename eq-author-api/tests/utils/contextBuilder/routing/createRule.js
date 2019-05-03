const executeQuery = require("../../executeQuery");

const createRoutingRuleMutation = `
      mutation createRoutingRule2($input: CreateRoutingRule2Input!) {
        createRoutingRule2(input: $input) {          
          id
          destination {
            id
          }
          routing {
            id
          }
          expressionGroup {
            id
            expressions {
              ...on ExpressionGroup2{
               id 
              }
            }
          }
        }
      }`;

const createRoutingRule = async (ctx, routing) => {
  const input = {
    routingId: routing.id,
  };
  const result = await executeQuery(
    createRoutingRuleMutation,
    {
      input,
    },
    ctx
  );
  return result.data.createRoutingRule2;
};

module.exports = {
  createRoutingRuleMutation,
  createRoutingRule,
};
