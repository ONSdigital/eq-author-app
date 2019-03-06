const upsertUser = require("./upsertUser");
const { getUserBySub } = require("../utils/datastore");

describe("Upsert User", () => {
  let req, res;
  beforeEach(() => {
    req = { params: { questionnaireId: 1 }, auth: { sub: "new_user" } };
    res = {
      json: jest.fn(),
    };
  });
  it("should create a user is one doesn't exist", async () => {
    await upsertUser(req, res);
    const user = await getUserBySub(req.auth.sub);
    expect(user).toMatchObject({
      sub: "new_user",
      id: expect.any(String),
    });
    expect(res.json).toHaveBeenCalledWith({ status: "OK" });
  });
  it("should update the user if any changes", async () => {
    req.auth.name = "my_name";
    await upsertUser(req, res);
    const user = await getUserBySub(req.auth.sub);
    expect(user).toMatchObject({
      sub: "new_user",
      id: expect.any(String),
      name: expect.stringMatching("my_name"),
    });
    expect(res.json).toHaveBeenCalledWith({ status: "OK" });
  });
});
