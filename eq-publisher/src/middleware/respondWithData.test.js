const respondWithData = require("./respondWithData");

describe("fetchData", () => {
  let res, req;

  beforeEach(() => {
    res = {
      locals: {
        questionnaire: { id: "123" }
      },
      json: jest.fn()
    };

    req = {};
  });

  it("respond with local data from response", () => {
    respondWithData(req, res);
    expect(res.json).toHaveBeenCalledWith(res.locals.questionnaire);
  });
});
