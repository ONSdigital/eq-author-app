import findById from "./findById";

describe("findById", () => {
  it("should find element by id property", () => {
    const items = [{ id: "1" }, { id: "2" }];
    expect(findById(items, "1")).toBe(items[0]);
  });

  it("should return nothing if no items match", () => {
    const items = [{ foo: "1" }, { bar: "2" }];
    expect(findById(items, "1")).toBeUndefined();
  });
});
