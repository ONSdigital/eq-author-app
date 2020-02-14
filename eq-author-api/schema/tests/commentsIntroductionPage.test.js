const { buildContext } = require("../../tests/utils/contextBuilder");

const { createQuestionnaire } = require("../../utils/datastore");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const { BUSINESS } = require("../../constants/questionnaireTypes");

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
  let ctx, questionnaire, introductionId;

  afterEach(async () => {
    if (!questionnaire) {
      return;
    }
    await deleteQuestionnaire(ctx, questionnaire.id);
    questionnaire = null;
  });

  beforeEach(async () => {
    ctx = await buildContext({
      type: BUSINESS,
      metadata: [{}],
      sections: [
        {
          pages: [{}],
        },
        {},
      ],
    });

    questionnaire = ctx.questionnaire;
    introductionId = questionnaire.introduction.id;
  });

  it("An empty comment array is created on new questionnare", async () => {
    const comment = await queryComments(ctx, {
      introductionId: introductionId,
    });

    expect(comment.questionnaireIntroduction).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  it("should add a comment on questionnaireIntroduction page and then query that comment", async () => {
    await createComment(ctx, {
      introductionId: introductionId,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      introductionId: introductionId,
    });

    expect(queryNewComments.questionnaireIntroduction).toMatchObject({
      id: introductionId,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });
  });

  it("should add multiple comments on questionnaireIntroduction page and then query those comments", async () => {
    await createComment(ctx, {
      introductionId: introductionId,
      commentText: "a new comment is created",
    });

    await createComment(ctx, {
      introductionId: introductionId,
      commentText: "a 2nd comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      introductionId: introductionId,
    });

    expect(queryNewComments.questionnaireIntroduction).toMatchObject({
      id: introductionId,
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

  it("should edit a comment on questionnaireIntroduction page and then query that comment", async () => {
    const newComment = await createComment(ctx, {
      introductionId: introductionId,
      commentText: "a new comment is created",
    });
    const commentId = newComment.id;

    const queryEditedComment = await updateComment(ctx, {
      introductionId: introductionId,
      commentId: commentId,
      commentText: "an edited comment",
    });

    expect(queryEditedComment).toMatchObject({
      id: commentId,
      commentText: "an edited comment",
      editedTime: expect.any(String),
    });
  });

  it("should delete a comment on questionnaireIntroduction page", async () => {
    const newComment = await createComment(ctx, {
      introductionId: introductionId,
      commentText: "a new comment is created",
    });

    const queriedComment = await deleteComment(ctx, {
      introductionId: introductionId,
      commentId: newComment.id,
    });

    expect(queriedComment.questionnaireIntroduction.comments).toHaveLength(0);
    expect(queriedComment).toMatchObject({
      questionnaireIntroduction: {
        id: introductionId,
        comments: [],
      },
    });
  });

  it("should create a comment object if Questionnaire doesn't have one", async () => {
    //creating a questionnaire outside resolvers to ensure no existing comment object...
    const questionnaire = await createQuestionnaire(ctx.questionnaire, ctx);

    const comment = await queryComments(ctx, {
      introductionId: questionnaire.introduction.id,
    });

    expect(comment.questionnaireIntroduction).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  describe("replies", () => {
    it("should add a reply to a comment - on questionnaireIntroduction page", async () => {
      const comment = await createComment(ctx, {
        introductionId: introductionId,
        commentText: "a new comment is created",
      });

      await createReply(ctx, {
        introductionId: introductionId,
        commentId: comment.id,
        commentText: "a new reply is created",
      });

      const queriedComment = await queryComments(ctx, {
        introductionId: introductionId,
      });

      expect(
        queriedComment.questionnaireIntroduction.comments[0].replies
      ).toMatchObject([{ commentText: "a new reply is created" }]);
    });

    it("should edit a reply on questionnaireIntroduction page", async () => {
      const newComment = await createComment(ctx, {
        introductionId: introductionId,
        commentText: "a new comment is created",
      });
      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        introductionId: introductionId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      const editedReply = await updateReply(ctx, {
        introductionId: introductionId,
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

    it("should delete a reply on questionnaireIntroduction page", async () => {
      const newComment = await createComment(ctx, {
        introductionId: introductionId,
        commentText: "a new comment is created",
      });

      const commentId = newComment.id;

      const reply = await createReply(ctx, {
        introductionId: introductionId,
        commentId: commentId,
        commentText: "a new reply is created",
      });

      const replyId = reply.id;

      await deleteReply(ctx, {
        introductionId: introductionId,
        commentId: commentId,
        replyId: replyId,
      });

      const queriedComment = await queryComments(ctx, {
        introductionId: introductionId,
      });
      expect(
        queriedComment.questionnaireIntroduction.comments[0].replies
      ).toHaveLength(0);
    });
  });
});
