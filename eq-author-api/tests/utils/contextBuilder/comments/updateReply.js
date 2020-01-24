const executeQuery = require("../../executeQuery");

const updateReplyMutation = `
  mutation updateReply($input: UpdateReplyInput!) {
    updateReply(input: $input) {
      id
      commentText
      editedTime
    }
  }
`;

const updateReply = async (ctx, input) => {
  const result = await executeQuery(updateReplyMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data.updateReply;
};

module.exports = {
  updateReplyMutation,
  updateReply,
};
