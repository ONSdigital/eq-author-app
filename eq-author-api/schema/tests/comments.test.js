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
} = require("../../tests/utils/contextBuilder/comments");

describe("comments", () => {
  let ctx, questionnaire, createdQuestionPage, createdCalSumPage;

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
      ],
    });
    questionnaire = ctx.questionnaire;
    createdQuestionPage = questionnaire.sections[0].pages[0];
    createdCalSumPage = questionnaire.sections[0].pages[1];
  });

  it("An empty comment array is created on new questionnare", async () => {
    const comment = await queryComments(ctx, {
      pageId: createdQuestionPage.id,
    });

    expect(comment).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });

  it("should add a comment on question page and then query that comment", async () => {
    await createComment(ctx, {
      pageId: createdQuestionPage.id,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      pageId: createdQuestionPage.id,
    });

    expect(queryNewComments).toMatchObject({
      id: createdQuestionPage.id,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });
  });

  it("should add multiple comments on question page and then query those comments", async () => {
    await createComment(ctx, {
      pageId: createdQuestionPage.id,
      commentText: "a new comment is created",
    });

    await createComment(ctx, {
      pageId: createdQuestionPage.id,
      commentText: "a 2nd comment is created",
    });

    const queryNewComments = await queryComments(ctx, {
      pageId: createdQuestionPage.id,
    });

    expect(queryNewComments).toMatchObject({
      id: createdQuestionPage.id,
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

    expect(queryNewComments).toMatchObject({
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
      pageId: createdQuestionPage.id,
      commentText: "a new comment is created",
    });
    const commentId = newComment.id;

    const queryEditedComment = await updateComment(ctx, {
      pageId: createdQuestionPage.id,
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
      pageId: createdQuestionPage.id,
      commentText: "a new comment is created",
    });

    const commentId = newComment.id;

    const queryComment = await deleteComment(ctx, {
      pageId: createdQuestionPage.id,
      commentId: commentId,
    });

    expect(queryComment.comments).toHaveLength(0);
    expect(queryComment).toMatchObject({
      id: createdQuestionPage.id,
      comments: [],
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

    const commentId = newComment.id;

    const queryComment = await deleteComment(ctx, {
      pageId: createdCalSumPage.id,
      commentId: commentId,
    });

    expect(queryComment.comments).toHaveLength(0);
    expect(queryComment).toMatchObject({
      id: createdCalSumPage.id,
      comments: [],
    });
  });

  it("should create a comment object if Questionnaire doesn't have one", async () => {
    //creating a questionnaire outside resolvers to ensure no existing comment object...
    const questionnaire = await createQuestionnaire(ctx.questionnaire, ctx);

    const comment = await queryComments(ctx, {
      pageId: questionnaire.sections[0].pages[0].id,
    });

    expect(comment).toMatchObject({
      id: expect.any(String),
      comments: expect.any(Array),
    });
  });
});
