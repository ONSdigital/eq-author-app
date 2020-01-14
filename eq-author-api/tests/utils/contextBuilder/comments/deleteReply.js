const executeQuery = require("../../executeQuery");

const deleteReplyMutation = `
  mutation deleteReply($input: DeleteReplyInput!) {
  deleteReply(input: $input) {
    id
    comments {
      id
      replies {
        id
      }
    }
  }
}
`;

const deleteReply = async (ctx, input) => {
  const result = await executeQuery(deleteReplyMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.deleteReply;
};

module.exports = {
  deleteReplyMutation,
  deleteReply,
};
