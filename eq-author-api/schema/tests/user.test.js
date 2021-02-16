const { buildContext } = require("../../tests/utils/contextBuilder");
const executeQuery = require("../../tests/utils/executeQuery");

describe("Users", () => {
  describe("list users", () => {
    it("should list all users", async () => {
      const contexts = await Promise.all([
        buildContext(null, { name: "User 1" }),
        buildContext(null, { name: "User 2" }),
      ]);
      const createdUsers = contexts.map((ctx) => ctx.user);

      const result = await executeQuery(`
      query {
        users {
          id
          name
        }
      }`);

      createdUsers.forEach((createdUser) => {
        const resultUser = result.data.users.find(
          (u) => u.id === createdUser.id
        );
        expect(resultUser).toMatchObject({
          id: createdUser.id,
          name: createdUser.name,
        });
      });
    });
  });
});
