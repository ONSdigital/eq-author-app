const hasUnreadComments = (comments, userId) => {
  let hasNotRead = false;
  if (!comments) {
    hasNotRead = false;
  }
  comments.forEach((comment) => {
    if (!comment.readBy.some((id) => userId === id)) {
      hasNotRead = true;
    }
    comment.replies.forEach((reply) => {
      if (!reply.readBy.some((id) => userId === id)) {
        hasNotRead = true;
      }
    });
  });
  return hasNotRead;
};

export default hasUnreadComments;
