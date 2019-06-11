const upsertUser = require("./upsertUser");
const { getUserByExternalId, createUser } = require("../../utils/datastore");
const defaultUser = require("../../tests/utils/mockUserPayload");

describe("Upsert User", () => {
  let req, res, next;
  beforeEach(() => {
    req = { params: { questionnaireId: 1 }, user: defaultUser() };
    res = {
      json: jest.fn(),
    };
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
});
