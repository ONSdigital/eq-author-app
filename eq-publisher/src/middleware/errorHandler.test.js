const errorHandler = require("./errorHandler");
const ValidationError = require("../validation/ValidationError");

describe("errorHandler", () => {
  let res, req, next;

  beforeEach(() => {
    res = {};
    res.status = jest.fn(() => res);
    res.json = jest.fn(() => res);

    req = {
      log: {
        error: jest.fn()
      }
    };

    next = jest.fn();
  });

  it("should log all errors", () => {
    const error = new Error("test error");
    errorHandler(error, req, res, next);

    expect(req.log.error).toHaveBeenCalledWith(error);
  });

  it("should respond with 422 status if ValidationError", () => {
    const error = new ValidationError("test error");
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(422);
  });

  it("should respond with 500 status if not ValidationError", () => {
    const error = new Error("test error");
    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it("should respond with JSON of error", () => {
    const error = new Error("test error");
    errorHandler(error, req, res, next);

    expect(res.json).toHaveBeenCalledWith(error);
  });

  it("should not pass control to next middleware", () => {
    const error = new Error("test error");
    errorHandler(error, req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
