const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryPrepopSchema,
  updatePrepopSchema,
} = require("../../tests/utils/contextBuilder/prepopschemaX");

const { BUSINESS } = require("../../constants/questionnaireTypes");

jest.mock("node-fetch");
const fetch = require("node-fetch");

describe("questionnaire", () => {
  let ctx, questionnaire;

  beforeEach(async () => {
    ctx = await buildContext({ type: BUSINESS });
    questionnaire = ctx.questionnaire;
  });

  afterEach(async () => {
    await deleteQuestionnaire(ctx, questionnaire.id);
  });

  fetch.mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => ({
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
      }),
    })
  );

  const prepopSchemaData = {
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
    it("should return the questionnaire prepopSchema", async () => {
      ctx.questionnaire.prepopSchema = prepopSchemaData;
      const prepopSchema = await queryPrepopSchema(ctx);
      expect(prepopSchema).toEqual(prepopSchemaData);
    });
  });

  describe("update", () => {
    it("should update the prepopSchema", async () => {
      const updatedPrepopSchema = await updatePrepopSchema(
        ctx,
        prepopSchemaData
      );
      expect(updatedPrepopSchema).toEqual(prepopSchemaData);
    });
  });
});
