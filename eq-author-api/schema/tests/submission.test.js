const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  querySubmission,
  updateSubmission,
} = require("../../tests/utils/contextBuilder/submission");

const { BUSINESS } = require("../../constants/questionnaireTypes");

describe("questionnaire", () => {
  let ctx, questionnaire;

  beforeEach(async () => {
    ctx = await buildContext({ type: BUSINESS });
    questionnaire = ctx.questionnaire;
    ctx.comments = {};
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("read", () => {
    it("should return the questionnaire submission", async () => {
      const submission = await querySubmission(
        ctx,
        questionnaire.submission.id
      );
      expect(submission).toEqual({
        id: expect.any(String),
        furtherContent: expect.any(String),
        viewPrintAnswers: expect.any(Boolean),
        emailConfirmation: expect.any(Boolean),
        feedback: expect.any(Boolean),
        validationErrorInfo: expect.any(Object),
      });
    });
  });

  describe("update", () => {
    it("should update the properties", async () => {
      const changes = {
        furtherContent: "Test",
        viewPrintAnswers: false,
        emailConfirmation: false,
        feedback: false,
      };

      const updatedSubmission = await updateSubmission(ctx, {
        ...changes,
      });

      expect(updatedSubmission).toEqual({
        id: questionnaire.submission.id,
        comments: null,
        ...changes,
        validationErrorInfo: expect.any(Object),
      });
    });
  });

  describe("comments", () => {
    it("should retrieve comments from context", async () => {
      ctx.comments = {};

      ctx.comments[questionnaire.submission.id] = [
        {
          id: "comment-1",
          commentText: "Test comment 1",
        },
        {
          id: "comment-2",
          commentText: "Test comment 2",
        },
      ];

      const updatedSubmission = await updateSubmission(ctx, {});

      expect(updatedSubmission.comments).toEqual(
        expect.arrayContaining(ctx.comments[questionnaire.submission.id])
      );
    });
  });

  describe("validation", () => {
    it("should validate the submission page when further content is empty", async () => {
      const changes = {
        furtherContent: "",
        viewPrintAnswers: false,
        emailConfirmation: false,
        feedback: false,
      };

      const updatedSubmission = await updateSubmission(ctx, {
        ...changes,
      });

      expect(updatedSubmission.validationErrorInfo).toMatchObject({
        totalCount: 1,
        errors: expect.arrayContaining([
          expect.objectContaining({ errorCode: "ERR_VALID_REQUIRED" }),
        ]),
      });
      expect(updatedSubmission.validationErrorInfo.errors).toHaveLength(1);

      const changes2 = {
        furtherContent: "Text",
        viewPrintAnswers: false,
        emailConfirmation: false,
        feedback: false,
      };

      const updatedSubmission2 = await updateSubmission(ctx, {
        ...changes2,
      });
      expect(updatedSubmission2.validationErrorInfo.errors).toHaveLength(0);
    });
  });
});
