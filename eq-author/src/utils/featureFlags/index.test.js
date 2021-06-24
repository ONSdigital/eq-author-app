import { enableOn, disableOn } from ".";

describe("Feature flags", () => {
  describe("Enabling a feature", () => {
    it("Can enable a feature if the flag is present", () => {
      expect(enableOn(["alpha"])).toBe(true);
    });

    it("Can enable the feature if every flag is present", () => {
      expect(enableOn(["alpha", "beta"])).toBe(true);
    });

    it("Doesn't enable a feature if the flag is not present", () => {
      expect(enableOn(["delta"])).toBe(false);
    });

    it("Doesn't enable a feature if not all of the flags are present", () => {
      expect(enableOn(["alpha", "detla"])).toBe(false);
    });
  });

  describe("Disabling a feature", () => {
    it("Can disable a feature if the flag is present", () => {
      expect(disableOn(["alpha"])).toBe(false);
    });

    it("Can disable the feature if every flag is present", () => {
      expect(disableOn(["alpha", "beta"])).toBe(false);
    });

    it("Doesn't disable a feature if the flag is not present", () => {
      expect(disableOn(["delta"])).toBe(true);
    });

    it("Doesn't disable a feature if not all of the flags are present", () => {
      expect(disableOn(["alpha", "detla"])).toBe(true);
    });
  });
});
