import { enableOn } from ".";

describe("Feature flags", () => {
  describe("Enabling a feature", () => {
    it("Can enable a feature if the flag is present", () => {
      expect(enableOn(["alpha"])).toBe(true);
    });

    it("Can enable the feature if every flag is present", () => {
      expect(enableOn(["alpha", "beta"])).toBe(true);
    });

    it("Fails if the flag is not present", () => {
      expect(enableOn(["delta"])).toBe(false);
    });

    it("Fails if not all of the flags are present", () => {
      expect(enableOn(["alpha", "detla"])).toBe(false);
    });
  });
});
