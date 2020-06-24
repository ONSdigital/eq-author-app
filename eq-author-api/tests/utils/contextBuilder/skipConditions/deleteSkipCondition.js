const executeQuery = require("../../executeQuery");

const deleteSkipConditionMutation = `
mutation deleteSkipCondition($input: DeleteSkipConditionInput!) {
  deleteSkipCondition(input: $input) {
    id
  }
}`;

const deleteSkipCondition = async (ctx, id) => {
  const input = {
    id: id,
  };
  const result = await executeQuery(
    deleteSkipConditionMutation,
    {
      input,
    },
    ctx
  );
  return result.data.deleteSkipCondition;
};

module.exports = {
  deleteSkipConditionMutation,
  deleteSkipCondition,
};
