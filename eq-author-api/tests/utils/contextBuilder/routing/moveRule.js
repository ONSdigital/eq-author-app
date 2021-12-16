const executeQuery = require("../../executeQuery");

const moveRoutingRuleMutation = `
      mutation moveRoutingRule2($input: MoveRoutingRule2Input!) {
        moveRoutingRule2(input: $input) {          
          id
          routing {
            id
            rules {
              id
            }
          }
        }
      }`;

const moveRoutingRule = async (ctx, rule, position) => {
  const input = {
    id: rule.id,
    position,
  };
  const result = await executeQuery(
    moveRoutingRuleMutation,
    {
      input,
    },
    ctx
  );
  return result.data.moveRoutingRule2;
};

module.exports = {
  moveRoutingRuleMutation,
  moveRoutingRule,
};
