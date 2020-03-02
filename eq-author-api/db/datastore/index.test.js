describe("Choosing which datastore to use", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  it("should error if the DATABASE env var is unset", () => {
    delete process.env.DATABASE;

    expect(process.env.DATABASE).toBeFalsy();
    expect(() => require("./index")).toThrow();
  });

  it("should error if the value of env var DATABASE is not recognised", () => {
    process.env.DATABASE = "this is not the env var you are looking for";
    expect(process.env.DATABASE).toBeTruthy();
    expect(process.env.DATABASE).toBe(
      "this is not the env var you are looking for"
    );
    expect(() => require("./index")).toThrow();
  });

  it("should not error otherwise", () => {
    expect(() => require("./index")).not.toThrow();
    expect(typeof require("./index")).toBe("object");
  });
});
