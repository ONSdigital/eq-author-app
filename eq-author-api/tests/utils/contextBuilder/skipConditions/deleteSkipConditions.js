const executeQuery = require("../../executeQuery");

const deleteSkipConditionsMutation = `
mutation deleteSkipConditions($input: DeleteSkipConditionsInput!) {
  deleteSkipConditions(input: $input) {
    id
  }
}`;

const deleteSkipConditions = async (ctx, parent) => {
  const input = {
    parentId: parent.id,
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
