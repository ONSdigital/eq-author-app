const executeQuery = require("../../executeQuery");

const createSkipConditionMutation = `
mutation createSkipCondition($input: CreateSkipConditionInput!) {
  createSkipCondition(input: $input) {
    id
  }
}`;

const createSkipCondition = async (ctx, parent) => {
  const input = {
    parentId: parent.id,
  };
  const result = await executeQuery(
    createSkipConditionMutation,
    {
      input,
    },
    ctx
  );
  return result.data.createSkipCondition;
};

module.exports = {
  createSkipConditionMutation,
  createSkipCondition,
};
