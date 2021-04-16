const gql = require("graphql-tag");

const { NUMBER } = require("../../constants/answerTypes");
const {
  PUBLISHED,
  UNPUBLISHED,
  AWAITING_APPROVAL,
} = require("../../constants/publishStatus");

const { buildContext } = require("../../tests/utils/contextBuilder");
const executeSubscription = require("../../tests/utils/executeSubscription");

const {
  updateQuestionnaire,
  deleteQuestionnaire,
  setQuestionnaireLocked,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  updateQuestionPage,
} = require("../../tests/utils/contextBuilder/page/questionPage");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../../tests/utils/contextBuilder/comments");

const wait = (timeout) =>
  new Promise((resolve) => setTimeout(() => resolve("timeout"), timeout));

jest.mock("node-fetch");
const fetch = require("node-fetch");

fetch.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    json: () => ({
      questionnaireId: "test",
      publishedSurveyUrl: "https://best.url.com",
    }),
  })
);

describe("subscriptions", () => {
  let ctx, questionnaire, iterator;

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
    iterator.return();
  });

  describe("validationUpdated", () => {
    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    title: "some value",
                    answers: [
                      {
                        type: NUMBER,
                        label: "Some number",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      questionnaire = ctx.questionnaire;
    });

    it("should update when something changes", async () => {
      const subscriptionQuery = gql`
        subscription Validation($id: ID!) {
          validationUpdated(id: $id) {
            id
            sections {
              id
              folders {
                pages {
                  id
                  ... on QuestionPage {
                    validationErrorInfo {
                      totalCount
                    }
                  }
                }
              }
            }
          }
        }
      `;
      iterator = await executeSubscription(
        subscriptionQuery,
        {
          id: questionnaire.id,
        },
        {
          user: ctx.user,
        }
      );

      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      await updateQuestionPage(ctx, {
        id: pageId,
        title: "",
      });
      const result = await iterator.next();

      const pageData =
        result.value.data.validationUpdated.sections[0].folders[0].pages[0];

      expect(pageData).toMatchObject({
        id: pageId,
        validationErrorInfo: {
          totalCount: 1,
        },
      });
    });

    it("should not update if the subscribed query is not updated", async () => {
      const subscriptionQuery = gql`
        subscription Validation($id: ID!) {
          validationUpdated(id: $id) {
            id
            errorCount
            pages {
              id
              errorCount
            }
          }
        }
      `;
      const ctx2 = await buildContext({});
      iterator = await executeSubscription(
        subscriptionQuery,
        {
          id: ctx2.questionnaire.id,
        },
        {
          user: ctx2.user,
        }
      );

      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      await updateQuestionPage(ctx, {
        id: pageId,
        title: "",
      });
      const promise = iterator.next();
      const result = await Promise.race([promise, wait(50)]);
      expect(result).toBe("timeout");
    });

    it("should not receive updates when the user does not have read permissions", async () => {
      const subscriptionQuery = gql`
        subscription Validation($id: ID!) {
          validationUpdated(id: $id) {
            id
            errorCount
            pages {
              id
              errorCount
            }
          }
        }
      `;
      const ctx2 = await buildContext({
        isPublic: false,
        sections: [
          {
            folders: [
              {
                pages: [{}],
              },
            ],
          },
        ],
      });
      iterator = await executeSubscription(
        subscriptionQuery,
        {
          id: ctx2.questionnaire.id,
        },
        {
          user: ctx.user,
        }
      );
      const pageId = ctx2.questionnaire.sections[0].folders[0].pages[0].id;
      await updateQuestionPage(ctx2, {
        id: pageId,
        title: "",
      });

      const promise = iterator.next();
      const result = await Promise.race([promise, wait(50)]);
      expect(result).toBe("timeout");
    });
  });

  describe("lockStatusUpdated", () => {
    beforeEach(async () => {
      ctx = await buildContext({ sections: [{}] });
      questionnaire = ctx.questionnaire;
    });

    const lockSubscription = gql`
      subscription LockStatusUpdated($id: ID) {
        lockStatusUpdated(id: $id) {
          id
          locked
        }
      }
    `;

    const parseResult = (result) => {
      const {
        value: {
          data: {
            lockStatusUpdated: { locked, id },
          },
        },
      } = result;
      return { locked, id };
    };

    it("should receive updates when questionnaires are locked", async () => {
      iterator = await executeSubscription(lockSubscription, {
        id: questionnaire.id,
      });
      await setQuestionnaireLocked(
        { questionnaireId: questionnaire.id, locked: true },
        ctx
      );

      let { locked, id } = parseResult(await iterator.next());
      expect(id).toEqual(questionnaire.id);
      expect(locked).toEqual(true);

      await setQuestionnaireLocked(
        { questionnaireId: questionnaire.id, locked: false },
        ctx
      );

      ({ locked, id } = parseResult(await iterator.next()));
      expect(id).toEqual(questionnaire.id);
      expect(locked).toEqual(false);
    });
  });

  describe("commentsUpdated", () => {
    let createdQuestionPage, componentId;

    beforeEach(async () => {
      ctx = await buildContext({
        sections: [
          {
            folders: [
              {
                pages: [
                  {
                    pageType: "QuestionPage",
                    title: "question page",
                  },
                  {
                    pageType: "calculatedSummary",
                    title: "calcSum page",
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
    });

    const commentsSubscription = gql`
      subscription CommentsUpdated($id: ID!) {
        commentsUpdated(id: $id) {
          id
        }
      }
    `;

    it("Question page - should send event when new comment is created", async () => {
      iterator = await executeSubscription(commentsSubscription, {
        id: componentId,
      });

      await createComment(ctx, {
        componentId,
        commentText: "a new comment is created",
      });

      const result = await iterator.next();

      expect(result.value.data.commentsUpdated.id).toBe(componentId);
    });

    it("Question page - should send event when comment has been updated", async () => {
      iterator = await executeSubscription(commentsSubscription, {
        id: componentId,
      });

      const newComment = await createComment(ctx, {
        componentId,
        commentText: "a new comment is created",
      });
      const commentId = newComment.id;

      await updateComment(ctx, {
        componentId,
        commentId: commentId,
        commentText: "an edited comment",
      });
      const result = await iterator.next();
      expect(result.value.data.commentsUpdated.id).toBe(componentId);
    });

    it("Question page - should send event when comment has been deleted", async () => {
      iterator = await executeSubscription(commentsSubscription, {
        id: componentId,
      });

      const newComment = await createComment(ctx, {
        componentId,
        commentText: "a new comment is created",
      });

      const commentId = newComment.id;

      await deleteComment(ctx, {
        componentId,
        commentId: commentId,
      });
      const result = await iterator.next();
      expect(result.value.data.commentsUpdated.id).toBe(componentId);
    });
  });

  describe("publishStatusUpdated", () => {
    const publishStatusSubscription = gql`
      subscription PublishStatus($id: ID!) {
        publishStatusUpdated(id: $id) {
          id
          publishStatus
        }
      }
    `;

    it("should send event when publish status goes from published to unpublished", async () => {
      ctx = await buildContext(
        {
          publishStatus: PUBLISHED,
          sections: [
            {
              folders: [
                {
                  pages: [
                    {
                      title: "some value",
                    },
                  ],
                },
              ],
            },
          ],
        },
        { admin: true }
      );
      questionnaire = ctx.questionnaire;
      iterator = await executeSubscription(publishStatusSubscription, {
        id: questionnaire.id,
      });
      const pageId = questionnaire.sections[0].folders[0].pages[0].id;
      await updateQuestionPage(ctx, {
        id: pageId,
        title: "asd",
      });
      const result = await iterator.next();
      expect(result.value.data.publishStatusUpdated.publishStatus).toBe(
        UNPUBLISHED
      );
    });

    it("should not send updates unless status goes from published to unpublished", async () => {
      ctx = await buildContext({ publishStatus: UNPUBLISHED });
      questionnaire = ctx.questionnaire;

      iterator = await executeSubscription(publishStatusSubscription, {
        id: questionnaire.id,
      });

      await updateQuestionnaire(ctx, {
        id: questionnaire.id,
        publishStatus: AWAITING_APPROVAL,
      });

      const promise = iterator.next();
      const result = await Promise.race([promise, wait(50)]);
      expect(result).toBe("timeout");
    });
  });
});
