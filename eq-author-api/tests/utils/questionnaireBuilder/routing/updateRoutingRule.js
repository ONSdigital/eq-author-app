const executeQuery = require("../../executeQuery");

const updateRoutingRuleMutation = `
      mutation updateRoutingRule2($input: UpdateRoutingRule2Input!) {
        updateRoutingRule2(input: $input) {
          id
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

const updateRoutingRule = async (questionnaire, input) => {
  const result = await executeQuery(
    updateRoutingRuleMutation,
    {
      input,
    },
    { questionnaire }
  );
  return result.data.updateRoutingRule2;
};

module.exports = {
  updateRoutingRuleMutation,
  updateRoutingRule,
};
