const status = require("./status");

describe("status middleware", () => {
  let req;
  let res;
  let previousEnv;

  beforeEach(() => {
    req = jest.fn();
    res = {
      json: jest.fn()
    };

    previousEnv = process.env;
  });

  it("should return OK status", () => {
    status(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "OK"
      })
    );
  });

  it("should include git commit if passed in env var", () => {
    process.env.EQ_AUTHOR_API_VERSION = "some-long-git-commit-id";
    status(req, res);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        version: process.env.EQ_AUTHOR_API_VERSION
      })
    );
  });

  afterEach(() => {
    process.env = previousEnv;
  });
});
