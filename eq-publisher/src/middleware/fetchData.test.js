const fetchData = require("./fetchData");

describe("fetchData", () => {
  let res, req, next, getQuestionnaire;

  beforeEach(() => {
    res = {
      locals: {
        accessToken: "123",
      },
      send: jest.fn(() => res),
      status: jest.fn(() => res),
    };

    req = {
      params: {
        questionnaireId: "123",
      },
    };

    getQuestionnaire = jest.fn().mockResolvedValue({});

    next = jest.fn();
  });

  it("should request data from API", async () => {
    await fetchData(getQuestionnaire)(req, res, next);

    expect(getQuestionnaire).toHaveBeenCalledWith(
      req.params.questionnaireId,
      res.locals.accessToken
    );
  });

  it("should pass error to next middleware if API errors", async () => {
    const error = new Error("oops");
    getQuestionnaire.mockImplementation(() => {
      throw error;
    });

    await fetchData(getQuestionnaire)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should respond with 404 if no questionnaire returned", async () => {
    getQuestionnaire.mockImplementation(() => Promise.resolve({ errors: {} }));

    await fetchData(getQuestionnaire)(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.any(Object),
        error: expect.any(Object),
      })
    );
  });

  it("should assign questionnaire for next middleware", async () => {
    const questionnaire = { id: "123" };

    getQuestionnaire.mockImplementation(() =>
      Promise.resolve({
        data: { questionnaire },
      })
    );

    await fetchData(getQuestionnaire)(req, res, next);

    expect(res.locals.questionnaire).toBe(questionnaire);
    expect(next).toHaveBeenCalledWith();
  });
});
