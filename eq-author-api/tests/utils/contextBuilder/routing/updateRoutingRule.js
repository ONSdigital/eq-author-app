const executeQuery = require("../../executeQuery");

const updateRoutingRuleMutation = `
      mutation updateRoutingRule2($input: UpdateRoutingRule2Input!) {
        updateRoutingRule2(input: $input) {
          id
          destination {
            id
            page {
              id
            }
            logical
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

const updateRoutingRule = async (ctx, input) => {
  const result = await executeQuery(
    updateRoutingRuleMutation,
    {
      input,
    },
    ctx
  );
  return result.data.updateRoutingRule2;
};

module.exports = {
  updateRoutingRuleMutation,
  updateRoutingRule,
};
