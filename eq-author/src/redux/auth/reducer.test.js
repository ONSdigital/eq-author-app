import reducer from "./reducer";
import { signInUser, signedOutUser } from "./actions";

const user = {
  uid: "user_id",
  displayName: "nick",
  photoURL: "picture",
  email: "email",
  stsTokenManager: { accessToken: "token" }
};

describe("auth reducer", () => {
  it("should start with null user", () => {
    expect(reducer(undefined, {})).toEqual({
      user: null,
      verifiedStatus: false
    });
  });

  it("should sign in user", () => {
    const state = reducer(undefined, signInUser(user));
    expect(state).toEqual({
      user: {
        id: user.uid,
        displayName: "nick",
        photoURL: "picture",
        email: "email"
      },
      verifiedStatus: true
    });
  });

  it("should sign out user", () => {
    const prevState = reducer(undefined, signInUser(user));
    const state = reducer(prevState, signedOutUser());

    expect(state).toEqual({
      user: null,
      verifiedStatus: true
    });
  });

  it("should return current state if action doesn't match", () => {
    const state = {};
    const action = { type: "FOO_BAR" };

    expect(reducer(state, action)).toBe(state);
  });
});
