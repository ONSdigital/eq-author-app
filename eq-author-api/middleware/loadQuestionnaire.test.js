const loadQuestionnaire = require("./loadQuestionnaire");
const { buildQuestionnaire } = require("../tests/utils/questionnaireBuilder");

describe("loadQuestionnaire", () => {
  it("should add a found questionnaire to the middleware", async () => {
    const questionnaire = await buildQuestionnaire({});
    const req = {
      header: jest.fn().mockReturnValue(questionnaire.id),
    };
    const res = {};
    await new Promise(resolve => {
      loadQuestionnaire(req, res, resolve);
    });
    expect(req.questionnaire).toEqual(questionnaire);
  });

  it("should not add a questionnaire to the req when no header is provided", async () => {
    const req = {
      header: jest.fn().mockReturnValue(null),
    };
    const res = {};
    await new Promise(resolve => {
      loadQuestionnaire(req, res, resolve);
    });
    expect(req.questionnaire).toEqual(undefined);
  });

  it("should not add a questionnaire to the req when the questionnaire is not found", async () => {
    const req = {
      header: jest.fn().mockReturnValue("missingId"),
    };
    const res = {};
    await new Promise(resolve => {
      loadQuestionnaire(req, res, resolve);
    });
    expect(req.questionnaire).toEqual(undefined);
  });
});
