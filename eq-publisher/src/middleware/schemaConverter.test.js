const schemaConverter = require("./schemaConverter");

describe("schemaConverter", () => {
  let res, req, next, converter, middleware, questionnaire;

  beforeEach(() => {
    questionnaire = { id: "123" };

    res = {
      locals: { questionnaire }
    };

    converter = {
      convert: jest.fn()
    };

    req = {};
    next = jest.fn();

    middleware = schemaConverter(converter);
  });

  it("should convert data", () => {
    converter.convert = jest.fn(() => Promise.resolve(questionnaire));
    middleware(req, res, next);

    expect(converter.convert).toHaveBeenCalledWith(questionnaire);
  });

  describe("when successful", () => {
    it("should assign converted questionnaire for next middleware", done => {
      const converted = { title: "i've been converted" };
      const onSuccess = Promise.resolve(converted);
      converter.convert = jest.fn(() => onSuccess);

      next = () => {
        expect(res.locals.questionnaire).toBe(converted);
        done();
      };

      middleware(req, res, next);
    });
  });

  describe("when error occurs", () => {
    it("should pass error to next middleware", done => {
      const ERROR = "FOO!!!";
      converter.convert = jest.fn(() => Promise.reject(ERROR));

      next = err => {
        expect(err).toBe(ERROR);
        done();
      };

      middleware(req, res, next);
    });
  });
});
