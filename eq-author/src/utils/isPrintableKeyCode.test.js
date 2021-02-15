import { isPrintableKeyCode } from "./isPrintableKeyCode";

describe("isPrintableKeyCode", () => {
  it("should return true for number keycodes", () => {
    for (let i = 48; i <= 57; i++) {
      expect(isPrintableKeyCode(i)).toBeTruthy();
    }
  });

  it("should return true for numpad keycodes", () => {
    for (let i = 96; i <= 111; i++) {
      expect(isPrintableKeyCode(i)).toBeTruthy();
    }
  });

  it("should return true for letter keycodes", () => {
    for (let i = 65; i <= 90; i++) {
      expect(isPrintableKeyCode(i)).toBeTruthy();
    }
  });

  it("should return true for space/backspace keycodes", () => {
    expect(isPrintableKeyCode(32)).toBeTruthy();
    expect(isPrintableKeyCode(8)).toBeTruthy();
  });

  it("should return true for other button keycodes", () => {
    for (let i = 186; i <= 192; i++) {
      expect(isPrintableKeyCode(i)).toBeTruthy();
    }
  });

  it("should return true for slashes and bracket keycodes", () => {
    for (let i = 219; i <= 222; i++) {
      expect(isPrintableKeyCode(i)).toBeTruthy();
    }
  });
});
