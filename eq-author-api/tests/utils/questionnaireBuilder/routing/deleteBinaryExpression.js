const executeQuery = require("../../executeQuery");

const deleteBinaryExpressionMutation = `
      mutation deleteBinaryExpression2($input: DeleteBinaryExpression2Input!) {
        deleteBinaryExpression2(input: $input) {          
          id
        }
      }`;

const deleteBinaryExpression = async (questionnaire, expression) => {
  const input = {
    id: expression.id,
  };
  const result = await executeQuery(
    deleteBinaryExpressionMutation,
    {
      input,
    },
    { questionnaire }
  );
  return result.data.deleteBinaryExpression2;
};

module.exports = {
  deleteBinaryExpressionMutation,
  deleteBinaryExpression,
};
