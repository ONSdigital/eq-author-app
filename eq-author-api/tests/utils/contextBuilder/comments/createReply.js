const executeQuery = require("../../executeQuery");

const createReplyMutation = `
mutation createReply($input: CreateReplyInput!) {
    createReply(input: $input) {
        id
        commentText
        createdTime
        user {
            id
            name
            picture
            email
            displayName
        }
        parentComment {
          id
          page {
            id
            comments {
             id
             replies {
                id
              }
            }
          }
      }
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
