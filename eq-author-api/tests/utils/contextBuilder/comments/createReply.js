const executeQuery = require("../../executeQuery");

const createReplyMutation = `
mutation CreateReply($input: CreateReplyInput!) {
  createReply(input: $input) {
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
}`;

const createReply = async (ctx, input) => {
  const result = await executeQuery(createReplyMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.createReply;
};

module.exports = {
  createReplyMutation,
  createReply,
};
