import { findUndeleteIndex } from "./findUndeleteIndex";
import { remove } from "lodash";

describe("findUndeleteIndex", () => {
  let items;

  beforeEach(() => {
    items = [
      {
        id: "1"
      },
      {
        id: "2"
      },
      {
        id: "3"
      }
    ];
  });

  it("should add the first item back at index 0", () => {
    const removedItem = remove(items, { id: "1" })[0];
    expect(findUndeleteIndex(items, removedItem.id)).toEqual(0);
  });

  it("should add the second item back in at index 1", () => {
    const removedItem = remove(items, { id: "2" })[0];
    expect(findUndeleteIndex(items, removedItem.id)).toEqual(1);
  });

  it("should add the third item back in at index 2", () => {
    const removedItem = remove(items, { id: "3" })[0];
    expect(findUndeleteIndex(items, removedItem.id)).toEqual(2);
  });

  it("should add an item with id 4 in at index 3", () => {
    expect(findUndeleteIndex(items, "4")).toEqual(3);
  });

  it("should deal work when Ids reach double digits", () => {
    expect(findUndeleteIndex(items, "10")).toEqual(3);
  });
});
