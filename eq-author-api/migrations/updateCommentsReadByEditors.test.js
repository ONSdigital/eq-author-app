const updateCommentsReadByEditors = require("./updateCommentsReadByEditors");
const { buildContext } = require("../tests/utils/contextBuilder");

const {
  getQuestionnaireMetaById,
  saveMetadata,
  saveComments,
  getCommentsForQuestionnaire,
} = require("../db/datastore");

const {
  queryComments,
  createComment,
  createReply,
} = require("../tests/utils/contextBuilder/comments");

describe("updateCommentsReadByEditors", () => {
  let ctx;
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
  });

  it("should create comment readBy value if undefined", async () => {
    const { user } = ctx;
    const componentId = ctx.questionnaire.sections[0].folders[0].pages[0].id;

    await createComment(ctx, {
      componentId,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, componentId);

    const comment = queryNewComments.comments[0];
    comment.readBy = undefined;

    const updatedQuestionnaire = await updateCommentsReadByEditors(
      ctx.questionnaire
    );
    const updatedPage = updatedQuestionnaire.sections[0].folders[0].pages[0];
    const queryUpdatedComments = await queryComments(ctx, updatedPage.id);

    expect(queryUpdatedComments).toMatchObject({
      comments: [
        {
          readBy: [user.id],
        },
      ],
    });
  });

  it("should create reply readBy value if undefined", async () => {
    const { user } = ctx;
    const componentId = ctx.questionnaire.sections[0].folders[0].pages[0].id;

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

    const queriedComment = queryNewComments.comments[0];
    queriedComment.replies[0].readBy = undefined;

    const updatedQuestionnaire = await updateCommentsReadByEditors(
      ctx.questionnaire
    );

    const updatedPage = updatedQuestionnaire.sections[0].folders[0].pages[0];
    const queryUpdatedComments = await queryComments(ctx, updatedPage.id);
    const updatedReply = queryUpdatedComments.comments[0].replies[0];

    expect(updatedReply).toMatchObject({
      readBy: [user.id],
    });
  });

  it("should add questionnaire author and editors to comment readBy array", async () => {
    const { user } = ctx;
    const metadata = await getQuestionnaireMetaById(ctx.questionnaire.id);
    const componentId = ctx.questionnaire.sections[0].folders[0].pages[0].id;

    metadata.editors = ["user1", "user2"];

    await saveMetadata({
      ...metadata,
    });

    await createComment(ctx, {
      componentId,
      commentText: "a new comment is created",
    });

    const queryNewComments = await queryComments(ctx, componentId);

    const comment = queryNewComments.comments[0];
    comment.readBy = null;

    await saveComments({
      comments: queryNewComments,
      questionnaireId: ctx.questionnaire.id,
    });

    await updateCommentsReadByEditors(ctx.questionnaire);

    const updatedQuestionnaireComments = await getCommentsForQuestionnaire(
      ctx.questionnaire.id
    );

    const updatedPageComments = updatedQuestionnaireComments.comments;

    // Default createdBy metadata value is ctx.user.id
    expect(updatedPageComments).toMatchObject({
      comments: [
        {
          readBy: [user.id, "user1", "user2"],
        },
      ],
    });
  });
});
