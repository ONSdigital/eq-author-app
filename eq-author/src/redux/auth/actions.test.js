import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import { SynchronousPromise } from "synchronous-promise";

describe("auth actions", () => {
  const user = {
    displayName: "foo",
    email: "foo@bar.com",
    photoURL: "http://foo.org/bar.jpg",
    stsTokenManager: {
      accessToken: "token",
    },
    toJSON: jest.fn(),
    uid: "user_id",
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
      onAuthStateChanged: jest.fn(),
    };

    const middleware = [thunk.withExtraArgument({ auth })];
    const mockStore = configureStore(middleware);
    store = mockStore({
      auth: { user },
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
        const { signOutUser } = getActions({
          REACT_APP_FULLSTORY_ORG: "ORG_ID",
        });
        return store.dispatch(signOutUser()).then(() => {
          expect(FS.identify).toHaveBeenCalledWith(false);
        });
      });
    });
  });

  describe("verifyAuthStatus", () => {
    let changeHandler, signInUser, verifyAuthStatus, signOutUser, signedOutUser;

    beforeEach(() => {
      window.fetch = jest.fn(() => SynchronousPromise.resolve());
      auth.onAuthStateChanged.mockImplementation(handler => {
        changeHandler = handler;
        return "FOOBAR";
      });

      const actions = getActions();
      signInUser = actions.signInUser;
      verifyAuthStatus = actions.verifyAuthStatus;
      signedOutUser = actions.signedOutUser;
      signOutUser = actions.signedOutUser;
    });

    afterEach(() => {
      delete window.fetch;
    });

    it("should return result of onAuthStateChanged", () => {
      const result = store.dispatch(verifyAuthStatus());
      expect(result).toBe("FOOBAR");
    });

    it("should start listening to auth changes", () => {
      store.dispatch(verifyAuthStatus());
      expect(auth.onAuthStateChanged).toHaveBeenCalledTimes(1);
    });

    it("should update the server with the new user", () => {
      store.dispatch(verifyAuthStatus());
      changeHandler({});
      expect(window.fetch).toHaveBeenCalledWith("/signIn", {
        method: "POST",
        headers: {
          authorization: expect.stringMatching(/^Bearer .?/),
        },
      });
    });

    it("should sign in user if determined to be authenticated", () => {
      store.dispatch(verifyAuthStatus());
      const toJSON = jest.fn().mockReturnValue(user);
      changeHandler({ toJSON });
      expect(store.getActions()).toEqual([signInUser(toJSON())]);
    });

    it("should not sign in user if determined to be unauthenticated", () => {
      store.dispatch(verifyAuthStatus());
      changeHandler();
      expect(store.getActions()).toEqual([signedOutUser()]);
    });

    it("should sign the user out if the fetch doesn't resolve correctly", () => {
      window.fetch = jest.fn(() => SynchronousPromise.reject());
      store.dispatch(verifyAuthStatus());
      const toJSON = jest.fn().mockReturnValue(user);
      changeHandler({ toJSON });

      expect(store.getActions()).toEqual([signOutUser()]);
    });

    describe("fullstory", () => {
      let FS;

      beforeEach(() => {
        verifyAuthStatus = getActions({ REACT_APP_FULLSTORY_ORG: "ORG_ID" })
          .verifyAuthStatus;
        window.FS = FS = { identify: jest.fn() };
      });

      afterEach(() => {
        delete window.FS;
      });

      it("should identify user with full story", () => {
        store.dispatch(verifyAuthStatus());
        const toJSON = jest.fn().mockReturnValue(user);
        changeHandler({ toJSON });

        expect(FS.identify).toHaveBeenCalledWith(user.email, {
          displayName: user.displayName,
        });
      });
    });
  });
});
