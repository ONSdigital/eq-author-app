const respondWithData = require("./respondWithData");

describe("fetchData", () => {
  let res, req;

  let trimmedQuestionnaire = {
    id: "123",
    sections: [
      {
        title: "Whitespaced"
      }
    ]
  };

  beforeEach(() => {
    res = {
      locals: {
        questionnaire: {
          id: "123   ",
          sections: [
            {
              title: "   Whitespaced   "
            }
          ]
        }
      },
      json: jest.fn()
    };

    req = {};
  });

  it("respond with local data from response", () => {
    respondWithData(req, res);
    expect(res.json).toHaveBeenCalledWith(trimmedQuestionnaire);
  });

  it("respond with trimmed data values", () => {
    respondWithData(req, res);
    expect(res.json).toHaveBeenCalledWith(trimmedQuestionnaire);
  });
});
