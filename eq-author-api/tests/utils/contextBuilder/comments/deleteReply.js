const executeQuery = require("../../executeQuery");

const deleteReplyMutation = `
  mutation DeleteReply($input: DeleteReplyInput!) {
  deleteReply(input: $input) {
    id
    commentText
    createdTime
    editedTime
    user {
      id
      name
      picture
      email
      displayName
    }
    parentCommentId
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
