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

  it("should not modify result obj if not questionnaire", async () => {
    await validateQuestionnaire(req, res, next);
    expect(res).toMatchObject({ a: 1 });
    expect(next).toHaveBeenCalled();
  });

  it("should add validationErrorInfo if questionnaire", async () => {
    req = {
      questionnaire: {
        id: 1,
      },
    };

    await validateQuestionnaire(req, res, next);
    expect(req.validationErrorInfo).toMatchObject({});
    expect(next).toHaveBeenCalled();
  });
});
