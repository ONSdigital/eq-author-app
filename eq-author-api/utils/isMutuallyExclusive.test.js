const isMutuallyExclusive = require("./isMutuallyExclusive");

describe("isMutuallyExclusive", () => {
  it("should return true when fields on object are mutually exclusive", () => {
    expect(isMutuallyExclusive(["a", "b"])({ a: "blah" })).toBeTruthy();
  });
  it("should return false when fields on object are not mutually exclusive", () => {
    expect(
      isMutuallyExclusive(["a", "b"])({ a: "blah", b: "laa" })
    ).toBeFalsy();
  });
});
