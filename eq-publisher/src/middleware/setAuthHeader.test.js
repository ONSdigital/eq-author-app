const setAuthHeader = require("./setAuthHeader");

describe("setAuthHeader", () => {
  it("should return a middleware function", () => {
    expect(setAuthHeader("some access token")).toEqual(expect.any(Function));
  });

  describe("calling the middleware function", () => {
    let middleware;
    let next;
    let options;

    beforeEach(() => {
      middleware = setAuthHeader("unique.access.token");
      next = jest.fn();
      options = {};
    });

    it("should set token in header of options", () => {
      middleware({ options }, next);
      expect(options).toMatchObject({
        headers: {
          authorization: "Bearer unique.access.token",
        },
      });
    });

    it("should call next middleware function", () => {
      middleware({ options }, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
