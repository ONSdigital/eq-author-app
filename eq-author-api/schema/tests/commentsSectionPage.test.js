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
  let ctx, questionnaire, sectionId;

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
          pages: [{}],
        },
        {},
      ],
    });

    questionnaire = ctx.questionnaire;
    sectionId = questionnaire.sections[0].id;
  });

  it("An empty comment array is created on new questionnare", async () => {
    const comment = await queryComments(ctx, {
      sectionId: sectionId,
    });

    expect(comment.section).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  it("should add a comment on section page and then query that comment", async () => {
    await createComment(ctx, {
      sectionId: sectionId,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      sectionId: sectionId,
    });

    expect(queryNewComments.section).toMatchObject({
      id: sectionId,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });
  });

  it("should add multiple comments on section page and then query those comments", async () => {
    await createComment(ctx, {
      sectionId: sectionId,
      commentText: "a new comment is created",
    });

    await createComment(ctx, {
      sectionId: sectionId,
      commentText: "a 2nd comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      sectionId: sectionId,
    });

    expect(queryNewComments.section).toMatchObject({
      id: sectionId,
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

  it("should edit a comment on section page and then query that comment", async () => {
    const newComment = await createComment(ctx, {
      sectionId: sectionId,
      commentText: "a new comment is created",
    });
    const commentId = newComment.id;

    const queryEditedComment = await updateComment(ctx, {
      sectionId: sectionId,
      commentId: commentId,
      commentText: "an edited comment",
    });

    expect(queryEditedComment).toMatchObject({
      id: commentId,
      commentText: "an edited comment",
      editedTime: expect.any(String),
    });
  });

  it("should delete a comment on section page", async () => {
    const newComment = await createComment(ctx, {
      sectionId: sectionId,
      commentText: "a new comment is created",
    });

    const queriedComment = await deleteComment(ctx, {
      sectionId: sectionId,
      commentId: newComment.id,
    });

    expect(queriedComment.section.comments).toHaveLength(0);
    expect(queriedComment).toMatchObject({
      section: {
        id: sectionId,
        comments: [],
      },
    });
  });

  it("should create a comment object if Questionnaire doesn't have one", async () => {
    //creating a questionnaire outside resolvers to ensure no existing comment object...
    const questionnaire = await createQuestionnaire(ctx.questionnaire, ctx);

    const comment = await queryComments(ctx, {
      sectionId: questionnaire.sections[0].id,
    });

    expect(comment.section).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  describe("replies", () => {
    it("should add a reply to a comment - on section page", async () => {
      const comment = await createComment(ctx, {
        sectionId: sectionId,
        commentText: "a new comment is created",
      });

      await createReply(ctx, {
        sectionId: sectionId,
        commentId: comment.id,
        commentText: "a new reply is created",
      });

      const queriedComment = await queryComments(ctx, {
        sectionId: sectionId,
      });

      expect(queriedComment.section.comments[0].replies).toMatchObject([
        { commentText: "a new reply is created" },
      ]);
    });

    it("should edit a reply on section page", async () => {
      const newComment = await createComment(ctx, {
        sectionId: sectionId,
        commentText: "a new comment is created",
      });
      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        sectionId: sectionId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      const editedReply = await updateReply(ctx, {
        sectionId: sectionId,
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

    it("should delete a reply on section page", async () => {
      const newComment = await createComment(ctx, {
        sectionId: sectionId,
        commentText: "a new comment is created",
      });

      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        sectionId: sectionId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      await deleteReply(ctx, {
        sectionId: sectionId,
        commentId: commentId,
        replyId: replyId,
      });

      const queriedComment = await queryComments(ctx, {
        sectionId: sectionId,
      });
      expect(queriedComment.section.comments[0].replies).toHaveLength(0);
    });
  });
});
