import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { SynchronousPromise } from "synchronous-promise";

describe("auth actions", () => {
  const user = {
    displayName: "foo",
    email: "foo@bar.com",
    photoURL: "http://foo.org/bar.jpg"
  };
  let store, auth;
  const getActions = (config = {}) => {
    jest.resetModules();
    jest.doMock("config", () => ({ ...config }));
    return require("./actions");
  };

  beforeEach(() => {
    auth = {
      signOut: jest.fn(() => SynchronousPromise.resolve()),
      onAuthStateChanged: jest.fn()
    };

    const middleware = [thunk.withExtraArgument({ auth })];
    const mockStore = configureStore(middleware);
    store = mockStore({
      auth: { user }
    });
  });

  afterAll(() => {
    jest.resetModules();
  });

  describe("signOutUser", () => {
    it("should sign user out", () => {
      const { signOutUser, signedOutUser } = getActions();
      return store.dispatch(signOutUser()).then(() => {
        expect(auth.signOut).toHaveBeenCalled();
        expect(store.getActions()).toEqual([signedOutUser()]);
      });
    });

    describe("fullstory", () => {
      let FS;

      beforeEach(() => {
        window.FS = FS = { identify: jest.fn() };
      });

      afterEach(() => {
        delete window.FS;
      });

      it("should anonymise user", () => {
        const { signOutUser } = getActions({ REACT_APP_USE_FULLSTORY: "true" });
        return store.dispatch(signOutUser()).then(() => {
          expect(FS.identify).toHaveBeenCalledWith(false);
        });
      });
    });
  });

  describe("verifyAuthStatus", () => {
    let changeHandler, signInUser, verifyAuthStatus, signedOutUser;

    beforeEach(() => {
      auth.onAuthStateChanged.mockImplementation(handler => {
        changeHandler = handler;
        return "FOOBAR";
      });

      const actions = getActions();
      signInUser = actions.signInUser;
      verifyAuthStatus = actions.verifyAuthStatus;
      signedOutUser = actions.signedOutUser;
    });

    it("should return result of onAuthStateChanged", () => {
      const result = store.dispatch(verifyAuthStatus());
      expect(result).toBe("FOOBAR");
    });

    it("should start listening to auth changes", () => {
      store.dispatch(verifyAuthStatus());
      expect(auth.onAuthStateChanged).toHaveBeenCalledTimes(1);
    });

    it("should sign in user if determined to be authenticated", () => {
      store.dispatch(verifyAuthStatus());
      changeHandler(user);
      expect(store.getActions()).toEqual([signInUser(user)]);
    });

    it("should not sign in user if determined to be unauthenticated", () => {
      store.dispatch(verifyAuthStatus());
      changeHandler();
      expect(store.getActions()).toEqual([signedOutUser()]);
    });

    describe("fullstory", () => {
      let FS;

      beforeEach(() => {
        verifyAuthStatus = getActions({ REACT_APP_USE_FULLSTORY: "true" })
          .verifyAuthStatus;
        window.FS = FS = { identify: jest.fn() };
      });

      afterEach(() => {
        delete window.FS;
      });

      it("should identify user with full story", () => {
        store.dispatch(verifyAuthStatus());
        changeHandler(user);

        expect(FS.identify).toHaveBeenCalledWith(user.email, {
          displayName: user.displayName
        });
      });
    });
  });
});
