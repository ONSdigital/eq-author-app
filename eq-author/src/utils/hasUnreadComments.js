const hasUnreadComments = (comments, userId) => {
  if (!comments) {
    return false;
  }
  comments.forEach((comment) => {
    if (!comment.readBy.some((id) => userId === id)) {
      return true;
    }
    comment.replies.forEach((reply) => {
      if (!reply.readBy.some((id) => userId === id)) {
        return true;
      }
    });
  });
  return false;
};

export default hasUnreadComments;
