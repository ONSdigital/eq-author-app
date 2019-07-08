const validateQuestionnaire = require("./validateQuestionnaire");

describe("validateQuestionnaire middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(async () => {
    req = {};
    res = { a: 1 };
    next = jest.fn();
  });

  it("should not modify result obj if not questionnaire", () => {
    validateQuestionnaire(req, res, next);
    expect(res).toMatchObject({ a: 1 });
    expect(next).toHaveBeenCalled();
  });

  it("should add validationErrorInfo if questionnaire", () => {
    req = {
      questionnaire: {
        id: 1,
      },
    };

    validateQuestionnaire(req, res, next);
    expect(req.validationErrorInfo).toMatchObject({});
    expect(next).toHaveBeenCalled();
  });
});
