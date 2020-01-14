const upsertUser = require("./upsertUser");
const { getUserByExternalId, createUser } = require("../../utils/datastore");
const defaultUser = require("../../tests/utils/mockUserPayload");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Upsert User", () => {
  let req, res, next;
  beforeEach(() => {
    req = { params: { questionnaireId: 1 }, user: defaultUser() };
    res = mockResponse();
    next = jest.fn();
  });

  it("should create a user if one doesn't exist", async () => {
    await upsertUser(req, res, next);
    const user = await getUserByExternalId(req.user.externalId);
    expect(user).toMatchObject(req.user);
    expect(res.json).toHaveBeenCalledWith({ status: "OK" });
  });

  it("should update the user if any changes to the user object", async () => {
    const { externalId, id } = req.user;
    await createUser(req.user);
    req.user.isVerified = true;
    req.user.name = "my_name";
    await upsertUser(req, res, next);
    const user = await getUserByExternalId(req.user.externalId);
    expect(user).toMatchObject({
      externalId,
      id,
      name: expect.stringMatching("my_name"),
    });
    expect(res.json).toHaveBeenCalledWith({ status: "OK" });
  });

  it("should stop unallowed emails from being saved", async () => {
    process.env.ALLOWED_EMAIL_LIST = "@a.fake.com";
    await upsertUser(req, res, next);
    const user = await getUserByExternalId(req.user.externalId);
    expect(user).toBeUndefined();
    expect(res.json).toHaveBeenCalledWith({
      status: "Email not in allowed email list",
    });
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should allowed user with valid email to save", async () => {
    process.env.ALLOWED_EMAIL_LIST = "@ons.gov.uk";
    await upsertUser(req, res, next);
    const user = await getUserByExternalId(req.user.externalId);
    expect(user).toMatchObject(req.user);
    expect(res.json).toHaveBeenCalledWith({ status: "OK" });
  });
});
