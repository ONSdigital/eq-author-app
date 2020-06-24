const executeQuery = require("../../executeQuery");

const deleteSkipConditionsMutation = `
mutation deleteSkipConditions($input: DeleteSkipConditionsInput!) {
  deleteSkipConditions(input: $input) {
    id
  }
}`;

const deleteSkipConditions = async (ctx, page) => {
  const input = {
    id: page.id,
  };
  const result = await executeQuery(
    deleteSkipConditionsMutation,
    {
      input,
    },
    ctx
  );
  return result.data.deleteSkipConditions;
};

module.exports = {
  deleteSkipConditionsMutation,
  deleteSkipConditions,
};
