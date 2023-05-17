const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryPrepopSchema,
  updatePrepopSchema,
} = require("../../tests/utils/contextBuilder/prepopschema");

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

  const prepopschemaData = {
    id: "121-222-789",
    schema: {
      id: "121-222-789",
      version: "1",
      dateCreated: "2023-01-12T13:37:27+00:00",
      turnover: {
        type: "number",
        example: "1000",
      },
      employeeCount: {
        type: "number",
        example: "50",
      },
    },
  };

  describe("read", () => {
    it("should return the questionnaire prepopschema", async () => {
      ctx.questionnaire.prepopschema = prepopschemaData;
      const prepopschema = await queryPrepopSchema(ctx);
      expect(prepopschema).toEqual(prepopschemaData);
    });
  });

  describe("update", () => {
    it("should update the prepopschema", async () => {
      const changes = {
        furtherContent: "Test",
        viewPrintAnswers: false,
        emailConfirmation: false,
        feedback: false,
      };

      const updatedPrepopSchema = await updatePrepopSchema(ctx, {
        ...changes,
      });

      expect(updatedPrepopSchema).toEqual({
        id: questionnaire.submission.id,
        comments: null,
        ...changes,
      });
    });
  });
});
