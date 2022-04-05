module.exports = {
  ...require("./createComment"),
  ...require("./queryComment"),
  ...require("./deleteComment"),
  ...require("./updateComment"),
  ...require("./createReply"),
  ...require("./updateReply"),
  ...require("./deleteReply"),
  ...require("./updateCommentsAsRead"),
};
