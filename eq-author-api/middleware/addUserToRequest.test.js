const addUserToRequest = require("./addUserToRequest");
const mockUserPayload = require("../tests/utils/mockUserPayload");

describe("Add user to request", () => {
  let req, res, next, send;
  beforeEach(() => {
    send = jest.fn();
    req = { params: { questionnaireId: 1 }, auth: { sub: "mock_user_sub" } };
    res = {
      status: jest.fn(() => ({ send })),
    };
    next = jest.fn();
  });
  it("should add user to the req object", async () => {
    await addUserToRequest(req, res, next);
    expect(req.user).toMatchObject(mockUserPayload);
    expect(next).toHaveBeenCalled();
  });
  it("should return a 401 if the user doesn't exist", async () => {
    req.auth.sub = "i_do_not_exist";
    await addUserToRequest(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(send).toHaveBeenCalled();
  });
});
