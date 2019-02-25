const version = require("./version");

describe("version middleware", () => {
  let req;
  let res;
  let next;
  let previousEnv;

  beforeEach(() => {
    res = {
      json: jest.fn(),
    };
    next = jest.fn();
    previousEnv = process.env;
    process.env = {
      ...process.env,
      EQ_AUTHOR_API_VERSION: "foo",
    };
  });

  it("should output a log on version mismatch", () => {
    req = {
      headers: { clientversion: "bar" },
      log: { warn: jest.fn() },
    };

    version(req, res, next);

    expect(req.log.warn).toHaveBeenCalled();

    expect(next).toHaveBeenCalled();
  });

  it("should do nothing on version match", () => {
    req = {
      headers: { clientversion: "foo" },
      log: { warn: jest.fn() },
    };

    version(req, res, next);

    expect(req.log.warn).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalled();
  });

  afterEach(() => {
    process.env = previousEnv;
  });
});
