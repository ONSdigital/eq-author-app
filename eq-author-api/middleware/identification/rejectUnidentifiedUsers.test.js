const rejectUnidentifiedUsers = require("./rejectUnidentifiedUsers");

describe("rejectUnidentifiedUsers", () => {
  let req, res, next;
  beforeEach(() => {
    req = {};
    res = { status: jest.fn(() => ({ send: jest.fn() })) };
    next = jest.fn();
  });

  it("should respond with 401 if the user is unverified", () => {
    req.user = { isVerified: false };
    rejectUnidentifiedUsers(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });
  it("should call next if user verified", () => {
    req.user = { isVerified: true };
    rejectUnidentifiedUsers(req, res, next);
    expect(next).toHaveBeenCalled();
  });
  it("should allow GET calls through", () => {
    req.method = "GET";
    rejectUnidentifiedUsers(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
