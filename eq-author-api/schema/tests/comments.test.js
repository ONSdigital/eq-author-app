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
  let ctx, questionnaire, createdCalSumPage, pageId;

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
            {},
            {
              pageType: "calculatedSummary",
            },
          ],
        },
        {},
      ],
    });
    questionnaire = ctx.questionnaire;
    createdCalSumPage = questionnaire.sections[0].pages[1];
    pageId = questionnaire.sections[0].pages[0].id;
  });

  it("An empty comment array is created on new questionnare", async () => {
    const comment = await queryComments(ctx, {
      pageId: pageId,
    });

    expect(comment.page).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  it("should add a comment on question page and then query that comment", async () => {
    await createComment(ctx, {
      pageId: pageId,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      pageId: pageId,
    });

    expect(queryNewComments.page).toMatchObject({
      id: pageId,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });
  });

  it("should add multiple comments on question page and then query those comments", async () => {
    await createComment(ctx, {
      pageId: pageId,
      commentText: "a new comment is created",
    });

    await createComment(ctx, {
      pageId: pageId,
      commentText: "a 2nd comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      pageId: pageId,
    });

    expect(queryNewComments.page).toMatchObject({
      id: pageId,
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

  it("should add a comment on calsum page and then query that comment", async () => {
    await createComment(ctx, {
      pageId: createdCalSumPage.id,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      pageId: createdCalSumPage.id,
    });

    expect(queryNewComments.page).toMatchObject({
      id: createdCalSumPage.id,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });
  });

  it("should edit a comment on question page and then query that comment", async () => {
    const newComment = await createComment(ctx, {
      pageId: pageId,
      commentText: "a new comment is created",
    });
    const commentId = newComment.id;

    const queryEditedComment = await updateComment(ctx, {
      pageId: pageId,
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
      pageId: pageId,
      commentText: "a new comment is created",
    });

    const queriedComment = await deleteComment(ctx, {
      pageId: pageId,
      commentId: newComment.id,
    });

    expect(queriedComment.page.comments).toHaveLength(0);
    expect(queriedComment).toMatchObject({
      page: {
        id: pageId,
        comments: [],
      },
    });
  });

  it("should edit a comment on calsum page and then query that comment", async () => {
    const newComment = await createComment(ctx, {
      pageId: createdCalSumPage.id,
      commentText: "a new comment is created",
    });

    const commentId = newComment.id;

    const queryEditedComment = await updateComment(ctx, {
      pageId: createdCalSumPage.id,
      commentId: commentId,
      commentText: "an edited comment",
    });

    expect(queryEditedComment).toMatchObject({
      id: commentId,
      commentText: "an edited comment",
      editedTime: expect.any(String),
    });
  });

  it("should delete a comment on calsum page", async () => {
    const newComment = await createComment(ctx, {
      pageId: createdCalSumPage.id,
      commentText: "a new comment is created",
    });

    const queriedComment = await deleteComment(ctx, {
      pageId: createdCalSumPage.id,
      commentId: newComment.id,
    });

    expect(queriedComment.page.comments).toHaveLength(0);
    expect(queriedComment).toMatchObject({
      page: {
        id: createdCalSumPage.id,
        comments: [],
      },
    });
  });

  it("should create a comment object if Questionnaire doesn't have one", async () => {
    //creating a questionnaire outside resolvers to ensure no existing comment object...
    const questionnaire = await createQuestionnaire(ctx.questionnaire, ctx);

    const comment = await queryComments(ctx, {
      pageId: questionnaire.sections[0].pages[0].id,
    });

    expect(comment.page).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  describe("replies", () => {
    it("should add a reply to a comment - on question page", async () => {
      const comment = await createComment(ctx, {
        pageId: pageId,
        commentText: "a new comment is created",
      });

      await createReply(ctx, {
        pageId: pageId,
        commentId: comment.id,
        commentText: "a new reply is created",
      });

      const queriedComment = await queryComments(ctx, {
        pageId: pageId,
      });

      expect(queriedComment.page.comments[0].replies).toMatchObject([
        { commentText: "a new reply is created" },
      ]);
    });

    it("should add a comment on calsum page and then reply to that comment", async () => {
      const newComment = await createComment(ctx, {
        pageId: createdCalSumPage.id,
        commentText: "a new comment is created",
      });

      await createReply(ctx, {
        pageId: createdCalSumPage.id,
        commentId: newComment.id,
        commentText: "a new reply is created",
      });

      const queriedComment = await queryComments(ctx, {
        pageId: createdCalSumPage.id,
      });

      expect(queriedComment.page.comments[0].replies).toMatchObject([
        { commentText: "a new reply is created" },
      ]);
    });

    it("should edit a reply on question page", async () => {
      const newComment = await createComment(ctx, {
        pageId: pageId,
        commentText: "a new comment is created",
      });
      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        pageId: pageId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      const editedReply = await updateReply(ctx, {
        pageId: pageId,
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

    it("should edit a reply on calcsum page", async () => {
      const newComment = await createComment(ctx, {
        pageId: createdCalSumPage.id,
        commentText: "a new comment is created",
      });
      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        pageId: createdCalSumPage.id,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      const editedReply = await updateReply(ctx, {
        pageId: createdCalSumPage.id,
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
        pageId: pageId,
        commentText: "a new comment is created",
      });

      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        pageId: pageId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      await deleteReply(ctx, {
        pageId: pageId,
        commentId: commentId,
        replyId: replyId,
      });

      const queriedComment = await queryComments(ctx, {
        pageId: pageId,
      });
      expect(queriedComment.page.comments[0].replies).toHaveLength(0);
    });

    it("should delete a reply on calcsum page", async () => {
      const newComment = await createComment(ctx, {
        pageId: createdCalSumPage.id,
        commentText: "a new comment is created",
      });

      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        pageId: createdCalSumPage.id,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      await deleteReply(ctx, {
        pageId: createdCalSumPage.id,
        commentId: commentId,
        replyId: replyId,
      });

      const queriedComment = await queryComments(ctx, {
        pageId: createdCalSumPage.id,
      });

      expect(queriedComment.page.comments[0].replies).toHaveLength(0);
    });
  });
});
