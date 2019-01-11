const createAuthMiddleware = require("./auth");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");

describe("auth middleware", () => {
  let logger;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
    };
  });

  it("should export a function", () => {
    expect(createAuthMiddleware).toEqual(expect.any(Function));
  });

  it("should create middleware function", () => {
    const middleware = createAuthMiddleware(logger);
    expect(middleware).toEqual(expect.any(Function));
  });

  describe("calling the middleware", () => {
    let req;
    let res;
    let next;

    let middleware;
    beforeEach(() => {
      req = {
        header: jest.fn(),
      };
      res = {
        send: jest.fn(),
      };
      next = jest.fn();

      middleware = createAuthMiddleware(logger);
    });

    it("should check the authorization header", () => {
      req.header.mockImplementation(() => null);

      middleware(req, res);

      expect(req.header).toHaveBeenCalledWith("authorization");
    });

    describe("invalid token", () => {
      it("should send a 401 response when no auth header", () => {
        req.header.mockImplementation(() => null);

        middleware(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });

      it("should send a 401 response when no token provided (empty)", () => {
        req.header.mockImplementation(() => "");

        middleware(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });

      it("should send a 401 response when no token provided (no token)", () => {
        req.header.mockImplementation(() => "Bearer ");

        middleware(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });

      it("should send a 401 response if token is invalid", () => {
        req.header.mockImplementation(() => "Bearer abc.def.ghi");

        middleware(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });
    });

    describe("valid token", () => {
      it("should add token payload to request if valid token", () => {
        let payload = {
          payload: {
            data: {
              some: "value",
            },
          },
        };

        const expected = jwt.sign(payload, uuid.v4());
        req.header.mockImplementation(() => `Bearer ${expected}`);
        middleware(req, res, next);
        expect(req.auth).toMatchObject(payload);
        expect(next).toHaveBeenCalled();
      });

      it("should add token payload to request if valid token with padding", () => {
        let payload = {
          payload: {
            data: {
              some: "value",
            },
          },
        };

        const expected = jwt.sign(payload, uuid.v4());
        const position = expected.indexOf(".");
        const expectedWithEquals = [
          expected.slice(0, position),
          "==",
          expected.slice(position),
        ].join("");
        req.header.mockImplementation(() => `Bearer ${expectedWithEquals}`);
        middleware(req, res, next);
        expect(req.auth).toMatchObject(payload);
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
