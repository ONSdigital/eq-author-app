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
          }      

        }
      }`;

const updateBinaryExpression = async (questionnaire, input) => {
  const result = await executeQuery(
    updateBinaryExpressionMutation,
    {
      input,
    },
    { questionnaire }
  );
  return result.data.updateBinaryExpression2;
};

module.exports = {
  updateBinaryExpressionMutation,
  updateBinaryExpression,
};
