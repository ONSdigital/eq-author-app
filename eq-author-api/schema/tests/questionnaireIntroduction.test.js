const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryQuestionnaireIntroduction,
  updateQuestionnaireIntroduction,
} = require("../../tests/utils/contextBuilder/questionnaireIntroduction");

const { BUSINESS } = require("../../constants/questionnaireTypes");

describe("questionnaire", () => {
  let ctx, questionnaire;

  beforeEach(async () => {
    ctx = await buildContext({ type: BUSINESS });
    questionnaire = ctx.questionnaire;
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  describe("read", () => {
    it("should return the questionnaire introduction", async () => {
      const introduction = await queryQuestionnaireIntroduction(
        ctx,
        questionnaire.introduction.id
      );
      expect(introduction).toEqual({
        id: expect.any(String),
        title: expect.any(String),
        description: expect.any(String),
        additionalGuidancePanel: expect.any(String),
        additionalGuidancePanelSwitch: expect.any(Boolean),
        secondaryTitle: expect.any(String),
        secondaryDescription: expect.any(String),
        collapsibles: expect.any(Array),
        tertiaryTitle: expect.any(String),
        tertiaryDescription: expect.any(String),
        contactDetailsPhoneNumber: expect.any(String),
        contactDetailsEmailAddress: expect.any(String),
        validationErrorInfo: expect.any(Object),
      });
    });
  });

  describe("update", () => {
    it("should update the properties", async () => {
      const changes = {
        title: "new title",
        description: "new description",
        additionalGuidancePanel: "new guidance panel",
        additionalGuidancePanelSwitch: true,
        secondaryTitle: "new secondaryTitle",
        secondaryDescription: "new secondaryDescription",
        tertiaryTitle: "new tertiaryTitle",
        tertiaryDescription: "new tertiaryDescription",
        contactDetailsPhoneNumber: "new contactDetailsPhoneNumber",
        contactDetailsEmailAddress: "new contactDetailsEmailAddress",
      };

      ctx.comments = {};

      const updatedIntroduction = await updateQuestionnaireIntroduction(ctx, {
        id: questionnaire.introduction.id,
        ...changes,
      });

      expect(updatedIntroduction).toEqual({
        id: questionnaire.introduction.id,
        collapsibles: expect.any(Array),
        additionalGuidancePanel: "new guidance panel",
        additionalGuidancePanelSwitch: true,
        validationErrorInfo: expect.any(Object),
        comments: null,
        ...changes,
      });
    });
  });

  describe("author validation", () => {
    it("should validate the introduction page and return the errors", async () => {
      const changes = {
        title: "new title",
        additionalGuidancePanelSwitch: true,
        description: "new description",
        secondaryTitle: "new secondaryTitle",
        secondaryDescription: "new secondaryDescription",
        tertiaryTitle: "new tertiaryTitle",
        tertiaryDescription: "new tertiaryDescription",
        contactDetailsPhoneNumber: "",
        contactDetailsEmailAddress: "",
      };

      ctx.comments = {};

      const updatedIntroduction = await updateQuestionnaireIntroduction(ctx, {
        id: questionnaire.introduction.id,
        ...changes,
      });

      expect(updatedIntroduction.validationErrorInfo).toMatchObject({
        totalCount: 2,
        errors: expect.any(Array),
      });
      expect(updatedIntroduction.validationErrorInfo.errors).toHaveLength(2);
    });
  });

  describe("comments", () => {
    it("should retrieve comments from context", async () => {
      ctx.comments = {};

      ctx.comments[questionnaire.introduction.id] = [
        {
          id: "comment-1",
          commentText: "Test comment 1",
        },
        {
          id: "comment-2",
          commentText: "Test comment 2",
        },
      ];

      const updatedIntroduction = await updateQuestionnaireIntroduction(ctx, {
        id: questionnaire.introduction.id,
      });

      expect(updatedIntroduction.comments).toEqual(
        expect.arrayContaining(ctx.comments[questionnaire.introduction.id])
      );
    });
  });
});
