const createAuthToken = require("./createAuthToken");
const jwt = require("jsonwebtoken");
const yaml = require("js-yaml");
const fs = require("fs");

describe("createAuthToken", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = jest.fn();
    res = {
      locals: {
        accessToken: "abc.def.ghi",
      },
    };
    next = jest.fn();
  });

  it("should return a middleware function", () => {
    expect(createAuthToken).toEqual(expect.any(Function));
  });

  describe("calling middleware", () => {
    it("should store token on response", () => {
      createAuthToken(req, res, next);
      expect(res.locals).toMatchObject({
        accessToken: expect.any(String),
      });
    });

    it("should create a valid token", () => {
      createAuthToken(req, res, next);
      expect(jwt.decode(res.locals.accessToken)).toMatchObject({
        serviceName: "publisher",
      });
    });

    it("should be signed using a private key", () => {
      createAuthToken(req, res, next);
      const keysYaml = yaml.load(fs.readFileSync("./keys.yml", "utf8"));
      const keysJson = JSON.parse(JSON.stringify(keysYaml));
      const publicKey = keysJson.keys.publisherAuthPublicKey.value;
      expect(
        jwt.verify(res.locals.accessToken, publicKey, { algorithms: ["RS256"] })
      ).toMatchObject({
        serviceName: "publisher",
      });
    });

    it("should call next middleware function", () => {
      createAuthToken(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
