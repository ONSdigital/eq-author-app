const { filter } = require("graphql-anywhere");
const gql = require("graphql-tag");
const executeQuery = require("../../executeQuery");

const moveRoutingRuleQuery = `
      mutation moveRoutingRule2($input: MoveRoutingRule2Input!) {
        moveRoutingRule2(input: $input) {          
          id
          routing {
            id
          }
        }
      }`;

const moveRoutingRule = async (ctx, rule) => {
  const input = {
    id: rule.id,
  };
  const result = await executeQuery(
    moveRoutingRuleQuery,
    {
      input: filter(
        gql`
          {
            id
            position
          }
        `,
        input
      ),
    },
    ctx
  );
  return result.data.moveRoutingRule2;
};

module.exports = {
  moveRoutingRuleQuery,
  moveRoutingRule,
};
