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
      guid: "cir-id-1",
      // eslint-disable-next-line camelcase
      ci_version: "1",
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
    await publishSchema(ctx);

    expect(ctx.questionnaire.publishHistory).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        cirId: "cir-id-1",
        cirVersion: "1",
        success: true,
      },
    ]);
  });

  it("should add to publishHistory if publishHistory is defined", async () => {
    ctx.questionnaire.publishHistory = [
      {
        id: "test-publish-history-event",
        surveyId: "123",
        formType: "",
        publishDate: new Date(),
        cirId: "cir-id-2",
        cirVersion: "1",
        success: true,
      },
    ];

    await publishSchema(ctx);

    expect(ctx.questionnaire.publishHistory).toEqual([
      {
        id: "test-publish-history-event",
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        cirId: "cir-id-2",
        cirVersion: "1",
        success: true,
      },
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        cirId: "cir-id-1",
        cirVersion: "1",
        success: true,
      },
    ]);
  });

  it("should handle error if there is an error fetching conversion URL", async () => {
    fetch.mockRejectedValueOnce(new Error("Test error"));

    await publishSchema(ctx);

    expect(ctx.questionnaire.publishHistory).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        success: false,
        errorMessage: "Failed to fetch questionnaire - Test error",
      },
    ]);
  });

  it("should add unsuccessful history event when response code is not 200", async () => {
    fetch.mockImplementation(() =>
      Promise.resolve({
        status: 418,
        statusText: "Server error",
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

    await publishSchema(ctx);

    expect(ctx.questionnaire.publishHistory).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        success: false,
        errorMessage:
          "Publisher failed to convert questionnaire - Server error",
      },
    ]);
  });

  it("should handle error if there is an error fetching CIR API gateway", async () => {
    // Mocks conversion fetch followed by API gateway rejected value
    fetch
      .mockResolvedValueOnce({
        status: 200,
        json: () => ({
          survey_id: "123", // eslint-disable-line
        }),
      })
      .mockRejectedValueOnce(new Error("Test error"));

    await publishSchema(ctx);

    expect(ctx.questionnaire.publishHistory).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        success: false,
        errorMessage: "Failed to publish questionnaire - Test error",
      },
    ]);
  });
});
