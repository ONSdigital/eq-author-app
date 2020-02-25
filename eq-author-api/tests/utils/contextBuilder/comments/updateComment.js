const executeQuery = require("../../executeQuery");

const updateCommentMutation = `
  mutation updateComment($input: UpdateCommentInput!) {
  updateComment(input: $input) {
    id
    commentText
    editedTime
  }
}
`;

const updateComment = async (ctx, input) => {
  const result = await executeQuery(updateCommentMutation, { input }, ctx);

  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data.updateComment;
};

module.exports = {
  updateCommentMutation,
  updateComment,
};
