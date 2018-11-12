import getNextOnDelete from "utils/getNextOnDelete";

describe("getNextOnDelete", () => {
  describe("when item is first in array", () => {
    it("should select first item when only one item", () => {
      const items = [{ id: "1" }];
      const { id } = getNextOnDelete(items, "1");

      expect(id).toBe("1");
    });

    it("should select following item when more than one item", () => {
      const items = [{ id: "1" }, { id: "2" }];
      const { id } = getNextOnDelete(items, "1");

      expect(id).toBe("2");
    });
  });

  describe("when item is not first in array", () => {
    it("should select previous item", () => {
      const items = [{ id: "1" }, { id: "2" }];
      const { id } = getNextOnDelete(items, "2");

      expect(id).toBe("1");
    });
  });
});
