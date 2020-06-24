const executeQuery = require("../../executeQuery");

const createSkipConditionMutation = `
mutation createSkipCondition($input: CreateSkipConditionInput!) {
  createSkipCondition(input: $input) {
    id
  }
}`;

const createSkipCondition = async (ctx, page) => {
  const input = {
    pageId: page.id,
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
