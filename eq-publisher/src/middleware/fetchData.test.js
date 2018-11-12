const fetchData = require("./fetchData");

describe("fetchData", () => {
  let res, req, next, API, fetcher;

  beforeEach(() => {
    res = {
      locals: {},
      send: jest.fn(() => res),
      status: jest.fn(() => res)
    };

    req = {
      params: {
        questionnaireId: "123"
      }
    };

    API = {
      getAuthorData: jest.fn(() => Promise.resolve({}))
    };

    next = jest.fn();

    fetcher = fetchData(API);
  });

  it("should request data from API", async () => {
    await fetcher(req, res, next);

    expect(API.getAuthorData).toHaveBeenCalledWith(req.params.questionnaireId);
  });

  it("should pass error to next middleware if API errors", async () => {
    const error = new Error("oops");
    API.getAuthorData.mockImplementation(() => {
      throw error;
    });

    await fetcher(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it("should respond with 404 if no questionnaire returned", async () => {
    API.getAuthorData.mockImplementation(() => Promise.resolve({ errors: {} }));

    await fetcher(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        params: expect.any(Object),
        error: expect.any(Object)
      })
    );
  });

  it("should assign questionnaire for next middleware", async () => {
    const questionnaire = { id: "123" };

    API.getAuthorData.mockImplementation(() =>
      Promise.resolve({
        data: { questionnaire }
      })
    );

    await fetcher(req, res, next);

    expect(res.locals.questionnaire).toBe(questionnaire);
    expect(next).toHaveBeenCalledWith();
  });
});
