const executeQuery = require("../../executeQuery");

const deleteRoutingRuleMutation = `
      mutation deleteRoutingRule2($input: DeleteRoutingRule2Input!) {
        deleteRoutingRule2(input: $input) {          
          id
          routing {
            id
          }
        }
      }`;

const deleteRoutingRule = async (ctx, rule) => {
  const input = {
    id: rule.id,
  };
  const result = await executeQuery(
    deleteRoutingRuleMutation,
    {
      input,
    },
    ctx
  );
  return result.data.deleteRoutingRule2;
};

module.exports = {
  deleteRoutingRuleMutation,
  deleteRoutingRule,
};
