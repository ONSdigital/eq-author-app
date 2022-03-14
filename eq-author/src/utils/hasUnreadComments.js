/*
  comments: Array of comments from the page
  userId: ID of the user currently signed in (from MeContext)
*/
const hasUnreadComments = (comments, userId) => {
  let hasNotRead = false;
  if (!comments) {
    hasNotRead = false;
    return hasNotRead;
  }
  comments.forEach((comment) => {
    // If signed in user has not read the comment
    if (!comment.readBy.some((id) => userId === id)) {
      hasNotRead = true;
    }
    comment.replies.forEach((reply) => {
      // If signed in user has not read the reply
      if (!reply.readBy.some((id) => userId === id)) {
        hasNotRead = true;
      }
    });
  });
  return hasNotRead;
};

export default hasUnreadComments;
