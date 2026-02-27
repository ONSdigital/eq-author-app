
const { buildContext } = require("../../tests/utils/contextBuilder");
//const { saveMetadata } = require("../../db/datastore");

const {
  createQuestionnaire,
} = require("../../tests/utils/contextBuilder/questionnaire");
const {
  publishSchema,
} = require("../../tests/utils/contextBuilder/publishSchema/publishSchema");

const fetch = require("node-fetch");

jest.mock("node-fetch");
//jest.mock("../../db/datastore");

//saveMetadata.mockImplementation((metadata) => Promise.resolve(metadata));

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

  it("should return a successful publish result", async () => {

    expect(await publishSchema(ctx)).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(String),
        cirId: "cir-id-1",
        cirVersion: "1",
        success: true,
        errorMessage: null,
        displayErrorMessage: null,
      },
    ]);
  });

  it("should add to publishHistory if publishHistory is defined", async () => {

    await publishSchema(ctx);

    expect(await publishSchema(ctx)).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(String),
        cirId: "cir-id-1",
        cirVersion: "1",
        success: true,
        errorMessage: null,
        displayErrorMessage: null,
      },
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(String),
        cirId: "cir-id-1",
        cirVersion: "1",
        success: true,
        errorMessage: null,
        displayErrorMessage: null,
      },
    ]);
  });

  it("should handle error if there is an error fetching conversion URL", async () => {
    fetch.mockRejectedValueOnce(new Error("Test error"));

    expect(await publishSchema(ctx)).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(String),
        success: false,
        errorMessage: "Failed to fetch questionnaire - Test error",
        displayErrorMessage: "Publish error, please try later",
        cirId: null,
        cirVersion: null,
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

    expect(await publishSchema(ctx)).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(String),
        success: false,
        errorMessage:
          "Publisher failed to convert questionnaire - Server error",
        displayErrorMessage: "Contact eQ services team",
        cirId: null,
        cirVersion: null,
      },
    ]);
  });

  it("should handle error if there is an error fetching from Validator", async () => {
    // Mocks conversion fetch followed by validator rejected value
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
        errorMessage: "Failed to connect to validator - Test error",
        displayErrorMessage: "Publish error, please try later",
      },
    ]);
  });

  it("should handle error if there is an error fetching from Validator with 200 response", async () => {
    // Mocks conversion fetch followed by validator rejected value
    fetch
      .mockResolvedValueOnce({
        status: 200,
        json: () => ({
          survey_id: "123", // eslint-disable-line
        }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: () => ({
          success: false,
          errors: [
            {
              instancePath: "",
              schemaPath: "#/required",
              keyword: "required",
              params: {
                missingProperty: "survey_id",
              },
              message: "must have required property 'survey_id'",
            },
          ],
        }),
      });

    await publishSchema(ctx);

    expect(ctx.questionnaire.publishHistory).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        success: false,
        errorMessage: "Questionnaire validation failed",
        displayErrorMessage: "Contact eQ services team",
      },
    ]);
  });

  it("should handle error if there is an error fetching from Validator with non 200 response", async () => {
    // Mocks conversion fetch followed by validator rejected value
    fetch
      .mockResolvedValueOnce({
        status: 200,
        json: () => ({
          survey_id: "123", // eslint-disable-line
        }),
      })
      .mockResolvedValueOnce({
        status: 404,
        json: () => ({}),
      });

    await publishSchema(ctx);

    expect(ctx.questionnaire.publishHistory).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(Date),
        success: false,
        errorMessage: "Validator returned non-200 error",
        displayErrorMessage: "Contact eQ services team",
      },
    ]);
  });

  it("should handle error if there is an error fetching CIR API gateway", async () => {
    // Mocks conversion fetch, then mocks validator fetch, followed by API gateway rejected value
    fetch
      .mockResolvedValueOnce({
        status: 200,
        json: () => ({
          survey_id: "123", // eslint-disable-line
        }),
      })
      .mockResolvedValueOnce({
        status: 200,
        json: () => ({
          survey_id: "123", // eslint-disable-line
        }),
      })
      .mockRejectedValueOnce(new Error("Test error"));

    expect(await publishSchema(ctx)).toEqual([
      {
        id: expect.any(String),
        surveyId: "123",
        formType: "",
        publishDate: expect.any(String),
        success: false,
        errorMessage: "Failed to publish questionnaire - Test error",
        displayErrorMessage: "Publish error, please try later",
        cirId: null,
        cirVersion: null,
      },
    ]);
  });
});
