const addVersion = require("./addVersion");

describe("addVersion", () => {
  it("should add version to questionnaire", () => {
    const result = addVersion({ id: 1, title: "foobar" });
    expect(result).toMatchObject({ version: 1 });
  });
});
