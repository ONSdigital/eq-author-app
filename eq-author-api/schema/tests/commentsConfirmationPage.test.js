const { buildContext } = require("../../tests/utils/contextBuilder");

const { createQuestionnaire } = require("../../utils/datastore");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");

const {
  queryComments,
  createComment,
  deleteComment,
  updateComment,
  createReply,
  updateReply,
  deleteReply,
} = require("../../tests/utils/contextBuilder/comments");

describe("comments", () => {
  let ctx, questionnaire, confirmationId;

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
          pages: [
            {
              confirmation: {},
            },
          ],
        },
      ],
    });

    questionnaire = ctx.questionnaire;
    confirmationId = questionnaire.sections[0].pages[0].confirmation.id;
  });

  it("should create an empty comment array on new questionnaires", async () => {
    const comment = await queryComments(ctx, {
      confirmationId,
    });

    expect(comment.confirmationPage).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  it("should add a comment on confirmationPage and then query that comment", async () => {
    await createComment(ctx, {
      confirmationId,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      confirmationId,
    });

    expect(queryNewComments.confirmationPage).toMatchObject({
      id: confirmationId,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });
  });

  it("should add multiple comments on confirmationPage and then query those comments", async () => {
    await createComment(ctx, {
      confirmationId,
      commentText: "a new comment is created",
    });

    await createComment(ctx, {
      confirmationId,
      commentText: "a 2nd comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      confirmationId,
    });

    expect(queryNewComments.confirmationPage).toMatchObject({
      id: confirmationId,
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

  it("should edit a comment on confirmationPage and then query that comment", async () => {
    const newComment = await createComment(ctx, {
      confirmationId,
      commentText: "a new comment is created",
    });
    const commentId = newComment.id;

    const queryEditedComment = await updateComment(ctx, {
      confirmationId,
      commentId,
      commentText: "an edited comment",
    });

    expect(queryEditedComment).toMatchObject({
      id: commentId,
      commentText: "an edited comment",
      editedTime: expect.any(String),
    });
  });

  it("should delete a comment on confirmationPage", async () => {
    const newComment = await createComment(ctx, {
      confirmationId,
      commentText: "a new comment is created",
    });

    const queriedComment = await deleteComment(ctx, {
      confirmationId,
      commentId: newComment.id,
    });

    expect(queriedComment.confirmationPage.comments).toHaveLength(0);
    expect(queriedComment).toMatchObject({
      confirmationPage: {
        id: confirmationId,
        comments: [],
      },
    });
  });

  it("should create a comment object if Questionnaire doesn't have one", async () => {
    const questionnaire = await createQuestionnaire(ctx.questionnaire, ctx);

    const comment = await queryComments(ctx, {
      confirmationId: questionnaire.sections[0].pages[0].confirmation.id,
    });

    expect(comment.confirmationPage).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  describe("replies", () => {
    it("should add a reply to a comment - on confirmationPage", async () => {
      const comment = await createComment(ctx, {
        confirmationId,
        commentText: "a new comment is created",
      });

      await createReply(ctx, {
        confirmationId,
        commentId: comment.id,
        commentText: "a new reply is created",
      });

      const queriedComment = await queryComments(ctx, {
        confirmationId,
      });

      expect(
        queriedComment.confirmationPage.comments[0].replies
      ).toMatchObject([{ commentText: "a new reply is created" }]);
    });

    it("should edit a reply on confirmationPage", async () => {
      const newComment = await createComment(ctx, {
        confirmationId,
        commentText: "a new comment is created",
      });
      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        confirmationId,
        commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      const editedReply = await updateReply(ctx, {
        confirmationId,
        commentId,
        replyId,
        commentText: "an edited comment",
      });

      expect(editedReply).toMatchObject({
        id: replyId,
        commentText: "an edited comment",
        editedTime: expect.any(String),
      });
    });

    it("should delete a reply on confirmationPage", async () => {
      const newComment = await createComment(ctx, {
        confirmationId,
        commentText: "a new comment is created",
      });

      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        confirmationId,
        commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      await deleteReply(ctx, {
        confirmationId,
        commentId,
        replyId,
      });

      const queriedComment = await queryComments(ctx, {
        confirmationId,
      });
      expect(queriedComment.confirmationPage.comments[0].replies).toHaveLength(
        0
      );
    });
  });
});
