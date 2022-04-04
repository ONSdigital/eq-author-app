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

  it("should add questionnaire author and editors to comment readBy array if undefined", async () => {
    const { user } = ctx;
    const metadata = await getQuestionnaireMetaById(ctx.questionnaire.id);
    const componentId = ctx.questionnaire.sections[0].folders[0].pages[0].id;

    metadata.editors = ["editor1", "editor2"];

    await saveMetadata({
      ...metadata,
    });

    await createComment(ctx, {
      componentId,
      commentText: "comment1",
    });

    await createComment(ctx, {
      componentId,
      commentText: "comment2",
    });

    const queryNewComments = await queryComments(ctx, componentId);

    const firstComment = queryNewComments.comments[0];
    firstComment.readBy = undefined;
    const secondComment = queryNewComments.comments[1];
    secondComment.readBy = undefined;

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
          commentText: "comment1",
          readBy: [user.id, "editor1", "editor2"],
        },
        {
          commentText: "comment2",
          readBy: [user.id, "editor1", "editor2"],
        },
      ],
    });
  });

  it("should add questionnaire author and editors to reply readBy array if undefined", async () => {
    const { user } = ctx;
    const metadata = await getQuestionnaireMetaById(ctx.questionnaire.id);
    const componentId = ctx.questionnaire.sections[0].folders[0].pages[0].id;

    metadata.editors = ["editor1", "editor2"];

    await saveMetadata({
      ...metadata,
    });

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

    const reply = queryNewComments.comments[0].replies[0];
    reply.readBy = undefined;

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
          readBy: [user.id],
          replies: [
            {
              readBy: [user.id, "editor1", "editor2"],
            },
          ],
        },
      ],
    });
  });

  it("should add questionnaire author and editors to both comment and reply readBy array if undefined", async () => {
    const { user } = ctx;
    const metadata = await getQuestionnaireMetaById(ctx.questionnaire.id);
    const componentId = ctx.questionnaire.sections[0].folders[0].pages[0].id;

    metadata.editors = ["editor1", "editor2"];

    await saveMetadata({
      ...metadata,
    });

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

    const reply = queryNewComments.comments[0].replies[0];
    reply.readBy = undefined;
    queryNewComments.comments[0].readBy = undefined;

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
          readBy: [user.id, "editor1", "editor2"],
          replies: [
            {
              readBy: [user.id, "editor1", "editor2"],
            },
          ],
        },
      ],
    });
  });
});
