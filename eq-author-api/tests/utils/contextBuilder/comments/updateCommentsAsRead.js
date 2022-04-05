const executeQuery = require("../../executeQuery");

const updateCommentsAsReadMutation = `
mutation UpdateCommentsAsRead($input: UpdateCommentsAsReadInput!) {
    updateCommentsAsRead(input: $input) {
      id
      readBy
      replies {
        id
        readBy
      }
    }
  }  
`;

const updateCommentsAsRead = async (ctx, input) => {
  const result = await executeQuery(
    updateCommentsAsReadMutation,
    { input },
    ctx
  );

  if (result.errors) {
    throw new Error(result.errors[0]);
  }
  return result.data.updateCommentAsRead;
};

module.exports = {
  updateCommentsAsReadMutation,
  updateCommentsAsRead,
};
