const { buildContext } = require("../../tests/utils/contextBuilder");

const {
  createQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  publishSchema,
} = require("../../tests/utils/contextBuilder/publishSchema/publishSchema");

const fetch = require("node-fetch");

jest.mock("node-fetch");

fetch.mockImplementation(() =>
  Promise.resolve({
    status: 200,
    json: () => ({
      publishHistory: [
        {
          id: "cir-id-1",
          version: "1",
        },
      ],
    }),
  })
);

describe("publish schema", () => {
  let ctx, config;
  beforeEach(async () => {
    ctx = await buildContext();
    config = {
      title: "Questionnaire title",
      surveyId: "123",
      theme: "business",
      shortTitle: "",
    };

    await createQuestionnaire(ctx, config);
  });

  it("should add publishHistory if publishHistory is undefined", async () => {
    const updatedQuestionnaire = await publishSchema(ctx);

    // TODO: publishDate: expect.any(Date) and fix values fetched from API - change updateQuestionnaire to ctx.questionnaire
    expect(updatedQuestionnaire.publishHistory).toEqual([
      expect.objectContaining({
        cirId: null,
        cirVersion: null,
        errorMessage: null,
        formType: "",
        id: expect.any(String),
        publishDate: expect.any(String),
        success: true,
        surveyId: "123",
      }),
    ]);
  });

  it("should add to publishHistory if publishHistory is not undefined", async () => {
    ctx.questionnaire.publishHistory = [
      {
        id: "test-publish-history-event",
        publishDate: new Date(),
        success: true,
      },
    ];
    const updatedQuestionnaire = await publishSchema(ctx);

    expect(updatedQuestionnaire.publishHistory.length).toBe(2);
    // TODO: publishDate: expect.any(Date) and fix values fetched from API - change updateQuestionnaire to ctx.questionnaire
    expect(updatedQuestionnaire.publishHistory).toEqual([
      expect.objectContaining({
        cirId: null,
        cirVersion: null,
        errorMessage: null,
        formType: null,
        id: "test-publish-history-event",
        publishDate: expect.any(String),
        success: true,
        surveyId: null,
      }),
      expect.objectContaining({
        cirId: null,
        cirVersion: null,
        errorMessage: null,
        formType: "",
        id: expect.any(String),
        publishDate: expect.any(String),
        success: true,
        surveyId: "123",
      }),
    ]);
  });

  it("should add unsuccessful history event when response code is not 200", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 418,
        json: () => ({
          publishHistory: [
            {
              id: "cir-id-1",
              version: "1",
            },
          ],
        }),
      })
    );

    const updatedQuestionnaire = await publishSchema(ctx);

    expect(updatedQuestionnaire.publishHistory).toEqual([
      expect.objectContaining({
        cirId: null,
        cirVersion: null,
        errorMessage: "Invalid response - failed with error code 418",
        formType: "",
        id: expect.any(String),
        publishDate: expect.any(String),
        success: false,
        surveyId: "123",
      }),
    ]);
  });
});
