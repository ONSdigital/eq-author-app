const executeQuery = require("../../executeQuery");

const createCommentMutation = `
mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
        id
        commentText
        createdTime
        page {
            id
            comments {
                id
            }
        }
        user {
            id
            name
            picture
            email
            displayName
        }
    }
}`;

const createComment = async (ctx, input) => {
  const result = await executeQuery(createCommentMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data.createComment;
};

module.exports = {
  createCommentMutation,
  createComment,
};
