describe("Choosing which datastore to use", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  it("should default to a datastore if the DATABASE env var is unset", () => {
    delete process.env.DATABASE;

    expect(() => require("./index")).not.toThrow();
    expect(typeof require("./index")).toBe("object");
  });

  it("should not error otherwise", () => {
    expect(() => require("./index")).not.toThrow();
    expect(typeof require("./index")).toBe("object");
  });
});
