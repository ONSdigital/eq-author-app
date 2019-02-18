const executeQuery = require("../../executeQuery");

const updateRoutingMutation = `
      mutation updateRouting2($input: UpdateRouting2Input!) {
        updateRouting2(input: $input) {
          id
          else {
            logical
            page {
              id
            }
            section {
              id
            }
          }
          rules {
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
        }
      }`;

const updateRouting = async (questionnaire, input) => {
  const result = await executeQuery(
    updateRoutingMutation,
    {
      input,
    },
    { questionnaire }
  );
  return result.data.updateRouting2;
};

module.exports = {
  updateRoutingMutation,
  updateRouting,
};
