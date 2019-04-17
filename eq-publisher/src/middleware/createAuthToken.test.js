const createAuthToken = require("./createAuthToken");
const jwt = require("jsonwebtoken");

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
        email: "eq.team@ons.gov.uk",
        name: "Publisher",
        picture: "",

        user_id: "Publisher",
      });
    });

    it("should call next middleware function", () => {
      createAuthToken(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });
});
