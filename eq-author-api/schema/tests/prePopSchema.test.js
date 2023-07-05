const { buildContext } = require("../../tests/utils/contextBuilder");
const {
  deleteQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  queryPrepopSchema,
  updatePrepopSchema,
  unlinkPrepopSchema,
} = require("../../tests/utils/contextBuilder/prepopSchema");

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

  let input = {
    id: "121-222-789",
    surveyId: "121",
    dateCreated: null,
    version: null,
  };

  fetch.mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => ({
        id: "121-222-789",
        surveyId: "121",
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
    surveyId: "121",
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

  describe("should query the prepop schema", () => {
    it("should return the questionnaire prepopSchema", async () => {
      ctx.questionnaire.prepopSchema = prepopSchemaData;
      const prepopSchema = await queryPrepopSchema(ctx);
      expect(prepopSchema).toEqual(prepopSchemaData);
    });
  });

  describe("should update the prepop schema", () => {
    it("should update the prepopSchema", async () => {
      const updatedPrepopSchema = await updatePrepopSchema(ctx, input);
      expect(updatedPrepopSchema).toEqual({ ...prepopSchemaData, ...input });
    });

    it("should update the prepop schema when surveyId is equal to 999", async () => {
      input = {
        id: "999-222-789",
        surveyId: "999",
      };

      const prepopSchemaData = {
        id: "999-222-789",
        surveyId: "999",
        dateCreated: "2023-01-12T13:37:27+00:00",
        version: "1",
        schema: {
          properties: {
            companyName: {
              type: "string",
              exampleValue: "Joe Bloggs PLC",
              fieldName: "companyName",
              id: expect.any(String),
            },
          },
        },
      };

      fetch.mockImplementationOnce(() =>
        Promise.resolve({
          status: 200,
          json: () => ({
            id: "999-222-789",
            surveyId: "999",
            dateCreated: "2023-01-12T13:37:27+00:00",
            version: "1",
            schema: {
              properties: {
                companyName: {
                  type: "string",
                  minLength: 1,
                  examples: ["Joe Bloggs PLC"],
                },
              },
            },
          }),
        })
      );

      const updatedPrepopSchema = await updatePrepopSchema(ctx, input);

      expect(updatedPrepopSchema).toEqual(prepopSchemaData);
    });
  });

  describe("should unlink the prepop schema", () => {
    it("should unlink the prepop schema", async () => {
      const unlinkedPrepopSchema = await unlinkPrepopSchema(ctx);
      expect(unlinkedPrepopSchema.prepopSchema).toEqual(null);
    });
  });
});
