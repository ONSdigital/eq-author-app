const createAuthHeaderMiddleware = require("./createAuthHeaderMiddleware");

describe("createAuthHeaderMiddleware", () => {
  let apolloFetch;

  beforeEach(() => {
    apolloFetch = {
      use: jest.fn(),
    };
  });

  it("should return a middleware function", () => {
    expect(createAuthHeaderMiddleware(apolloFetch)).toEqual(
      expect.any(Function)
    );
  });

  describe("calling middleware", () => {
    let middleware;

    let req;
    let res;
    let next;

    beforeEach(() => {
      middleware = createAuthHeaderMiddleware(apolloFetch);

      req = jest.fn();
      res = {
        locals: {
          accessToken: "abc.def.ghi",
        },
      };
      next = jest.fn();
    });

    it("should use apollo fetch middleware", () => {
      middleware(req, res, next);
      expect(apolloFetch.use).toHaveBeenCalledWith(expect.any(Function));
    });

    it("should call next middleware function", () => {
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
