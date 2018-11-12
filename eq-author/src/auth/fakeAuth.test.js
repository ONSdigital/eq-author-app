import fakeAuth from "./fakeAuth";

describe("SignInForm", () => {
  describe("onAuthStateChanged", () => {
    it("should return a function", () => {
      const unsubscribe = fakeAuth.onAuthStateChanged(jest.fn());
      expect(unsubscribe).toBeInstanceOf(Function);
    });

    it("should invoke the callback", () => {
      const handleAuthStateChanged = jest.fn();
      fakeAuth.onAuthStateChanged(handleAuthStateChanged);

      expect(handleAuthStateChanged).toHaveBeenCalled();
    });
  });

  describe("signOut", () => {
    it("should return a promise", () => {
      return expect(fakeAuth.signOut()).resolves.toBe();
    });
  });
});
