import fsm from "./fsm";

describe("fsm", () => {
  describe("initial states", () => {
    it("has default initial state", () => {
      const machine = fsm({ initial: {} });
      expect(machine.state()).toBe("initial");
    });

    it("allows user-configurable starting state", () => {
      const states = {
        foo: {},
      };
      const machine = fsm(states, "foo");
      expect(machine.state()).toBe("foo");
    });

    it("throws if unrecognised initial state", () => {
      expect(() => fsm({}, "foo")).toThrowError();
    });
  });

  describe("transitioning", () => {
    const states = {
      locked: {
        coin: "unlocked",
      },
      unlocked: {
        push: "locked",
      },
    };

    let turnstile;
    beforeEach(() => {
      turnstile = fsm(states, "locked");
    });

    it("returns new state if transition valid", () => {
      expect(turnstile.transition("coin")).toBe("unlocked");
      expect(turnstile.state()).toBe("unlocked");
    });

    it("returns undefined if transition invalid", () => {
      expect(turnstile.transition("push")).toBeUndefined();
      expect(turnstile.state()).toBe("locked");
    });
  });
});
