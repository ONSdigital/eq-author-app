import hasUnreadComments from "./hasUnreadComments";

describe("hasUnreadComments", () => {
  const user = {
    id: "user-1",
  };

  describe("Comments", () => {
    it("should return false when there are no comments", () => {
      const comments = [];
      expect(hasUnreadComments(comments, user.id)).toBeFalsy();
    });

    it("should return false when all comments are read", () => {
      const comments = [
        {
          id: "comment-1",
          commentText: "Test",
          replies: [],
          readBy: [user.id],
        },
        {
          id: "comment-2",
          commentText: "Test",
          replies: [],
          readBy: [user.id],
        },
      ];
      expect(hasUnreadComments(comments, user.id)).toBeFalsy();
    });

    it("should return true when a comment is unread", () => {
      const comments = [
        {
          id: "comment-1",
          commentText: "Test",
          replies: [],
          readBy: [user.id],
        },
        {
          id: "comment-2",
          commentText: "Test",
          replies: [],
          readBy: [],
        },
      ];
      expect(hasUnreadComments(comments, user.id)).toBeTruthy();
    });

    it("should return true when a comment has been read by a different user", () => {
      const comments = [
        {
          id: "comment-1",
          commentText: "Test",
          replies: [],
          readBy: ["user-2"],
        },
        {
          id: "comment-2",
          commentText: "Test",
          replies: [],
          readBy: ["user-2"],
        },
      ];
      expect(hasUnreadComments(comments, "user-2")).toBeFalsy();
      expect(hasUnreadComments(comments, user.id)).toBeTruthy();
    });
  });

  describe("Replies", () => {
    it("should return false when there are no replies", () => {
      const comments = [
        {
          id: "comment-1",
          commentText: "Test",
          replies: [],
          readBy: [user.id],
        },
      ];
      expect(hasUnreadComments(comments, user.id)).toBeFalsy();
    });

    it("should return false when all replies are read", () => {
      const comments = [
        {
          id: "comment-1",
          commentText: "Test",
          replies: [
            {
              id: "reply-1",
              parentCommentId: "comment-1",
              commentText: "Test",
              readBy: [user.id],
            },
          ],
          readBy: [user.id],
        },
        {
          id: "comment-2",
          commentText: "Test",
          replies: [
            {
              id: "reply-2",
              parentCommentId: "comment-2",
              commentText: "Test",
              readBy: [user.id],
            },
          ],
          readBy: [user.id],
        },
      ];
      expect(hasUnreadComments(comments, user.id)).toBeFalsy();
    });

    it("should return true when a reply is unread", () => {
      const comments = [
        {
          id: "comment-1",
          commentText: "Test",
          replies: [
            {
              id: "reply-1",
              parentCommentId: "comment-1",
              commentText: "Test",
              readBy: [user.id],
            },
          ],
          readBy: [user.id],
        },
        {
          id: "comment-2",
          commentText: "Test",
          replies: [
            {
              id: "reply-2",
              parentCommentId: "comment-2",
              commentText: "Test",
              readBy: [],
            },
          ],
          readBy: [user.id],
        },
      ];
      expect(hasUnreadComments(comments, user.id)).toBeTruthy();
    });

    it("should return true when a comment has been read by a different user", () => {
      const comments = [
        {
          id: "comment-1",
          commentText: "Test",
          replies: [
            {
              id: "reply-1",
              parentCommentId: "comment-1",
              commentText: "Test",
              readBy: [user.id, "user-2"],
            },
          ],
          readBy: [user.id, "user-2"],
        },
        {
          id: "comment-2",
          commentText: "Test",
          replies: [
            {
              id: "reply-2",
              parentCommentId: "comment-2",
              commentText: "Test",
              readBy: ["user-2"],
            },
          ],
          readBy: [user.id, "user-2"],
        },
      ];
      expect(hasUnreadComments(comments, "user-2")).toBeFalsy();
      expect(hasUnreadComments(comments, user.id)).toBeTruthy();
    });
  });
});
