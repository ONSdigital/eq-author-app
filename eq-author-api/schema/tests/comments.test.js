const { buildContext } = require("../../tests/utils/contextBuilder");

const { createQuestionnaire } = require("../../utils/datastore");

const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryComments,
  createComment,
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

    const queryNewComment = await queryComments(ctx, {
      pageId: createdQuestionPage.id,
    });

    expect(queryNewComment).toMatchObject({
      id: createdQuestionPage.id,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
    });
  });

  it("should add a comment on calsum page and then query that comment", async () => {
    await createComment(ctx, {
      pageId: createdCalSumPage.id,
      commentText: "a new comment is created",
    });

    const queryNewComment = await queryComments(ctx, {
      pageId: createdCalSumPage.id,
    });

    expect(queryNewComment).toMatchObject({
      id: createdCalSumPage.id,
      comments: [
        {
          commentText: "a new comment is created",
        },
      ],
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
