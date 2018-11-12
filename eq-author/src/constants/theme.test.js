import { colors } from "constants/theme";
import { values } from "lodash";

describe("constants/theme", () => {
  it("should export a module with valid hex colour values", () => {
    expect(
      values(colors).every(color => {
        return /^#[0-9A-F]{6}$/i.test(color);
      })
    ).toBe(true);
  });
});
