const loadQuestionnaire = require("./loadQuestionnaire");
const { buildContext } = require("../tests/utils/contextBuilder");

describe("loadQuestionnaire", () => {
  it("should add a found questionnaire to the middleware", async () => {
    const ctx = await buildContext({});
    const { questionnaire } = ctx;
    const req = {
      header: jest.fn().mockReturnValue(questionnaire.id),
    };
    const res = {};
    await new Promise((resolve) => {
      loadQuestionnaire(req, res, resolve);
    });
    expect(req.questionnaire && req.questionnaire.id).toEqual(questionnaire.id);
  });

  it("should not add a questionnaire to the req when no header is provided", async () => {
    const req = {
      header: jest.fn().mockReturnValue(null),
    };
    const res = {};
    await new Promise((resolve) => {
      loadQuestionnaire(req, res, resolve);
    });
    expect(req.questionnaire).toEqual(undefined);
  });

  it("should not add a questionnaire to the req when the questionnaire is not found", async () => {
    const req = {
      header: jest.fn().mockReturnValue("missingId"),
    };
    const res = {};
    await new Promise((resolve) => {
      loadQuestionnaire(req, res, resolve);
    });
    expect(req.questionnaire).toEqual(null);
  });
  it("should not load private questionnaire if user is not an editor", async () => {
    const ctx = await buildContext({ isPublic: false });
    const { questionnaire } = ctx;

    const req = {
      header: jest.fn().mockReturnValue(questionnaire.id),
      user: { id: "unauthorizedId" },
    };

    const send = jest.fn();
    const res = {
      status: jest.fn(() => ({
        send,
      })),
    };

    await loadQuestionnaire(req, res);
    expect(send).toHaveBeenCalledWith("Unauthorized questionnaire access");
    expect(res.status).toHaveBeenCalledWith(403);
    expect(req.questionnaire).toEqual(undefined);
  });

  it("should load private questionnaire if user is an admin", async () => {
    const ctx = await buildContext({ isPublic: false });
    const { questionnaire } = ctx;

    const req = {
      header: jest.fn().mockReturnValue(questionnaire.id),
      user: { id: "unauthorizedId", admin: true },
    };

    const next = jest.fn();
    const res = {
      status: jest.fn(() => ({
        send: jest.fn(),
      })),
    };

    await loadQuestionnaire(req, res, next);
    expect(req.questionnaire && req.questionnaire.id).toEqual(questionnaire.id);
    expect(next).toHaveBeenCalled();
  });
});
