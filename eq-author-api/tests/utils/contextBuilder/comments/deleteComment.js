const executeQuery = require("../../executeQuery");

const deleteCommentMutation = `
 mutation deleteComment($input: DeleteCommentInput!) {
  deleteComment(input: $input) {
    id
    commentText
    user {
      id
      name
      picture
      email
      displayName
    }
    createdTime
    editedTime
    replies {
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
    }
  }
}
`;

const deleteComment = async (ctx, input) => {
  const result = await executeQuery(deleteCommentMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }

  return result.data;
};

module.exports = {
  deleteCommentMutation,
  deleteComment,
};
