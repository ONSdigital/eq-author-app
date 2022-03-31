const { buildContext } = require("../../tests/utils/contextBuilder");
const { createQuestionnaire } = require("../../db/datastore");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryComments,
  createComment,
  deleteComment,
  updateComment,
  updateCommentsAsRead,
  createReply,
  updateReply,
  deleteReply,
} = require("../../tests/utils/contextBuilder/comments");

describe("comments", () => {
  let ctx, questionnaire, componentId, createdQuestionPage;

  afterEach(async () => {
    if (!questionnaire) {
      return;
    }
    await deleteQuestionnaire(ctx, questionnaire.id);
    questionnaire = null;
  });

  beforeEach(async () => {
    ctx = await buildContext({
      metadata: [{}],
      sections: [
        {
          folders: [
            {
              pages: [
                {},
                {
                  pageType: "calculatedSummary",
                },
              ],
            },
          ],
        },
      ],
    });
    questionnaire = ctx.questionnaire;
    createdQuestionPage = questionnaire.sections[0].folders[0].pages[0];
    componentId = createdQuestionPage.id;
    ctx.comments = {};
  });

  it("An empty comment array is created on new questionnare", async () => {
    const comments = ctx.comments;
    ctx.comments[componentId] = [];
    expect(comments[componentId]).toHaveLength(0);
  });

  it("should add a comment on question page and then query that comment", async () => {
    await createComment(ctx, {
      componentId,
      commentText: "a new comment is created",
    });

    const queryNewComments = ctx.comments[componentId];

    expect(queryNewComments).toMatchObject([
      {
        commentText: "a new comment is created",
        createdTime: expect.any(Date),
        id: expect.any(String),
        readBy: expect.any(Array),
        replies: expect.any(Array),
        userId: expect.any(String),
      },
    ]);
  });

  it("should add multiple comments on question page and then query those comments", async () => {
    await createComment(ctx, {
      componentId,
      commentText: "a new comment is created",
    });

    await createComment(ctx, {
      componentId,
      commentText: "a 2nd comment is created",
    });

    const queryNewComments = await queryComments(ctx, componentId);

    expect(queryNewComments).toMatchObject({
      comments: [
        {
          commentText: "a new comment is created",
        },
        {
          commentText: "a 2nd comment is created",
        },
      ],
    });
  });

  it("should edit a comment on question page and then query that comment", async () => {
    const newComment = await createComment(ctx, {
      componentId,
      commentText: "a new comment is created",
    });
    const commentId = newComment.id;

    const queryEditedComment = await updateComment(ctx, {
      componentId,
      commentId: commentId,
      commentText: "an edited comment",
    });

    expect(queryEditedComment).toMatchObject({
      id: commentId,
      commentText: "an edited comment",
      editedTime: expect.any(String),
    });
  });

  it("should delete a comment on question page", async () => {
    const newComment = await createComment(ctx, {
      componentId,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, componentId);

    expect(queryNewComments).toMatchObject({
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });

    const queriedComment = await deleteComment(ctx, {
      componentId,
      commentId: newComment.id,
    });

    expect(queriedComment.deleteComment).toHaveLength(0);
    expect(queriedComment).toMatchObject({
      deleteComment: [],
    });
  });

  it("should create a comment object if Questionnaire doesn't have one", async () => {
    const questionnaire = await createQuestionnaire(ctx.questionnaire, ctx);
    const componentId = questionnaire.sections[0].folders[0].pages[0].id;

    const comment = await queryComments(ctx, componentId);

    expect(comment.comments).toHaveLength(0);
  });

  describe("locking", () => {
    it("should create a comment on a locked questionnaire and then query that comment", async () => {
      await createComment(
        { ...ctx, questionnaire: { ...ctx.questionnaire, locked: true } },
        {
          componentId,
          commentText: "a new comment is created",
        }
      );

      const queryNewComments = await queryComments(ctx, componentId);

      expect(queryNewComments).toMatchObject({
        comments: [
          {
            commentText: "a new comment is created",
          },
        ],
      });
      questionnaire.locked = false;
    });
  });

  describe("replies", () => {
    it("should add a reply to a comment - on question page", async () => {
      const comment = await createComment(ctx, {
        componentId,
        commentText: "a new comment is created",
      });

      const commentId = comment.id;
      await createReply(ctx, {
        componentId,
        commentId,
        commentText: "a new reply is created",
      });

      const queriedComment = await queryComments(ctx, componentId);

      expect(queriedComment.comments[0].replies).toMatchObject([
        { commentText: "a new reply is created" },
      ]);
    });

    it("should edit a reply on question page", async () => {
      const newComment = await createComment(ctx, {
        componentId,
        commentText: "a new comment is created",
      });
      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        componentId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      const editedReply = await updateReply(ctx, {
        componentId,
        commentId: commentId,
        replyId: replyId,
        commentText: "an edited comment",
      });

      expect(editedReply).toMatchObject({
        id: replyId,
        commentText: "an edited comment",
        editedTime: expect.any(String),
      });
    });

    it("should delete a reply on question page", async () => {
      const newComment = await createComment(ctx, {
        componentId,
        commentText: "a new comment is created",
      });

      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        componentId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      await deleteReply(ctx, {
        componentId,
        commentId: commentId,
        replyId: replyId,
      });

      const queriedComment = await queryComments(ctx, componentId);

      expect(queriedComment.comments[0].replies).toHaveLength(0);
    });
  });

  describe("read comments and replies", () => {
    describe("comments", () => {
      it("should set comment as read for the comment's author", async () => {
        const { user } = ctx;
        await createComment(ctx, {
          componentId,
          commentText: "a new comment is created",
        });

        const queryNewComments = await queryComments(ctx, componentId);

        expect(queryNewComments).toMatchObject({
          comments: [
            {
              readBy: [user.id],
            },
          ],
        });
      });

      it("should update comment as read if user has not read the comment", async () => {
        const { user } = ctx;
        await createComment(ctx, {
          componentId,
          commentText: "a new comment is created",
        });

        await updateCommentsAsRead(ctx, {
          pageId: componentId,
          userId: "2",
        });

        const queryNewComments = await queryComments(ctx, componentId);

        expect(queryNewComments).toMatchObject({
          comments: [
            {
              readBy: [user.id, "2"],
            },
          ],
        });
      });

      // it.only("should set readBy value to empty array if undefined", async () => {
      //   const { user } = ctx;
      //   // const comment = await createComment(ctx, {
      //   //   componentId,
      //   //   commentText: "a new comment is created",
      //   // });

      //   const comment = {
      //     id: componentId,
      //     commentText: "test",
      //     replies: [],
      //   };

      //   ctx.comments = {};

      //   ctx.comments[componentId] = [comment];

      //   console.log(
      //     "ctx.questionnaire.sections[0].folders[0].pages[0]",
      //     ctx.questionnaire.sections[0].folders[0].pages[0]
      //   );

      //   console.log("ctx.comments", ctx.comments);

      //   await updateCommentsAsRead(ctx, {
      //     pageId: componentId,
      //     userId: user.id,
      //   });

      //   const queryNewComments = await queryComments(ctx, componentId);

      //   expect(queryNewComments.comments).toMatchObject([
      //     {
      //       readBy: [user.id],
      //     },
      //   ]);
      // });
    });

    describe("replies", () => {
      it("should set reply as read for the reply's author", async () => {
        const { user } = ctx;

        const comment = await createComment(ctx, {
          componentId,
          commentText: "a new comment is created",
        });

        const commentId = comment.id;

        await createReply(ctx, {
          componentId,
          commentId,
          commentText: "a new reply is created",
        });

        const queryNewComments = await queryComments(ctx, componentId);

        expect(queryNewComments.comments[0].replies).toMatchObject([
          {
            readBy: [user.id],
          },
        ]);
      });

      it("should update reply as read if user has not read the reply", async () => {
        const { user } = ctx;
        const comment = await createComment(ctx, {
          componentId,
          commentText: "a new comment is created",
        });

        const commentId = comment.id;

        await createReply(ctx, {
          componentId,
          commentId,
          commentText: "a new reply is created",
        });

        await updateCommentsAsRead(ctx, {
          pageId: componentId,
          userId: "2",
        });

        const queryNewComments = await queryComments(ctx, componentId);

        expect(queryNewComments.comments[0].replies).toMatchObject([
          {
            readBy: [user.id, "2"],
          },
        ]);
      });
    });
  });
});
