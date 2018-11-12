const addPrefix = require("./addPrefix");

describe("Add Prefix", () => {
  it("should prepend 'Copy of' to a value without markup tags when no prefix is supplied", () => {
    const value = "Hello";

    const updatedValue = addPrefix(value);

    expect(updatedValue).toBe(`Copy of ${value}`);
  });

  it("should prepend 'Copy of' to a value with markup tags when no prefix is supplied", () => {
    const value = "<p>Hello</p>";

    const updatedValue = addPrefix(value);

    const startsWithCopyOf = updatedValue.startsWith("Copy of ", 3);

    expect(startsWithCopyOf).toBe(true);
  });

  it("should not prepend 'Copy of' to a value without markup tags when a prefix is supplied", () => {
    const value = "Hello";

    const updatedValue = addPrefix(value, "Oh,");

    expect(updatedValue).not.toBe(`Copy of ${value}`);
  });

  it("should not prepend 'Copy of' to a value with markup tags when a prefix is supplied", () => {
    const value = "<p>Hello</p>";

    const updatedValue = addPrefix(value, "Oh,");

    const startsWithCopyOf = updatedValue.startsWith("Copy of ", 3);

    expect(startsWithCopyOf).toBe(false);
  });

  it("should prepend a value without markup tags with a given prefix", () => {
    const value = "Hello";

    const updatedValue = addPrefix(value, "Oh, ");

    expect(updatedValue).toBe(`Oh, ${value}`);
  });

  it("should prepend a value with markup tags with a given prefix", () => {
    const value = "<p>Hello</p>";

    const updatedValue = addPrefix(value, "Oh, ");

    const startsWithCopyOf = updatedValue.startsWith("Oh, ", 3);

    expect(startsWithCopyOf).toBe(true);
  });

  it("should not prepend an empty value", () => {
    expect(addPrefix("")).toEqual("");
  });

  it("should not prepend an empty value surrounded by tags", () => {
    expect(addPrefix("<p></p>")).toEqual("<p></p>");
  });
});
