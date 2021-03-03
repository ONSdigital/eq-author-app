const identificationMiddleware = require("./");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const yaml = require("js-yaml");
const fs = require("fs");

const keysFile = "./keys.test.yml";
const keysYaml = yaml.load(fs.readFileSync(keysFile, "utf8"));
const keysJson = JSON.parse(JSON.stringify(keysYaml));

const { createUser } = require("../../db/datastore");

jest.mock("./verifyJwtToken", () => {
  const jwt = require("jsonwebtoken");
  return jest.fn(accessToken => {
    const jwtToken = jwt.decode(accessToken);

    return new Promise(async resolve => {
      resolve(jwtToken.id !== "invalid.token");
    });
  });
});

describe("auth middleware", () => {
  let logger;

  beforeEach(() => {
    logger = {
      error: jest.fn(),
    };
  });

  it("should export a function", () => {
    expect(identificationMiddleware).toEqual(expect.any(Function));
  });

  it("should create middleware function", () => {
    const middleware = identificationMiddleware(logger);
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

      middleware = identificationMiddleware(logger);
    });

    it("should check the authorization header", () => {
      req.header.mockImplementation(() => null);

      middleware(req, res);

      expect(req.header).toHaveBeenCalledWith("authorization");
    });

    describe("invalid token", () => {
      it("should send a 401 response when no auth header", async () => {
        req.header.mockImplementation(() => null);

        await middleware(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });

      it("should send a 401 response when no token provided (empty)", async () => {
        req.header.mockImplementation(() => "");

        await middleware(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });

      it("should send a 401 response when no token provided (no token)", async () => {
        req.header.mockImplementation(() => "Bearer ");

        await middleware(req, res);

        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });

      it("should send a 401 response if token is invalid", async () => {
        req.header.mockImplementation(() => "Bearer abc.def.ghi");
        await middleware(req, res);
        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });

      it("should send a 401 response if token is valid but unverified", async () => {
        let sub = uuidv4();
        let auth = { id: "invalid.token", name: "foo", sub };

        const expected = jwt.sign(auth, uuidv4());

        req.header.mockImplementation(() => `Bearer ${expected}`);

        await middleware(req, res);
        expect(logger.error).toHaveBeenCalled();
        expect(res.send).toHaveBeenCalledWith(401);
      });
    });

    describe("valid token", () => {
      it("if user exists should add user to request", async () => {
        let sub = uuidv4();
        let auth = { name: "foo", sub };
        await createUser({ name: "foo", externalId: sub });
        const expected = jwt.sign(auth, uuidv4());
        req.header.mockImplementation(() => `Bearer ${expected}`);
        await middleware(req, res, next);
        expect(req.user).toMatchObject({
          id: expect.any(String),
          externalId: sub,
          name: "foo",
          isVerified: true,
        });
        expect(next).toHaveBeenCalled();
      });

      it("if user doesn't exist should add temp user to request", async () => {
        let sub = uuidv4();
        let auth = { name: "foo", sub };

        const expected = jwt.sign(auth, uuidv4());
        req.header.mockImplementation(() => `Bearer ${expected}`);
        await middleware(req, res, next);
        expect(req.user).toMatchObject({
          externalId: sub,
          name: "foo",
          isVerified: false,
        });
        expect(next).toHaveBeenCalled();
      });

      it("if user is a service should add service to list", async () => {
        const oldKeysFile = process.env.KEYS_FILE;
        process.env.KEYS_FILE = "./keys.test.yml";
        let auth = { serviceName: "publisher" };
        const expected = jwt.sign(auth, keysJson.keys.publisher.value, {
          algorithm: "RS256",
        });
        req.header.mockImplementation(() => `Bearer ${expected}`);
        await middleware(req, res, next);
        expect(req.user).toMatchObject({
          id: "publisher",
          name: "publisher",
          isVerified: true,
        });
        expect(next).toHaveBeenCalled();
        process.env.KEYS_FILE = oldKeysFile;
      });
    });
  });
});
