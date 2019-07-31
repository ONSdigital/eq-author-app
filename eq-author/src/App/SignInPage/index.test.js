import React from "react";
import SignInPage from "App/SignInPage";
import { MeContext } from "App/MeContext";
import { shallow } from "enzyme";
import { render } from "tests/utils/rtl";

describe("SignInPage", () => {
  let signIn, signOut, isSigningIn;

  beforeEach(() => {
    signIn = jest.fn();
    signOut = jest.fn();
    isSigningIn = false;
  });

  describe("signInPage", () => {
    it("should render", () => {
      const wrapper = shallow(
        <MeContext.Provider value={{ signOut, signIn, isSigningIn }}>
          <SignInPage />
        </MeContext.Provider>
      );
      expect(
        wrapper
          .dive()
          .dive()
          .dive()
          .contains("You must be signed in to access this service.")
      ).toBeTruthy();
    });

    it("should load a loding page if currently signing in", () => {
      const { getByText } = render(
        <MeContext.Provider value={{ signOut, signIn, isSigningIn: true }}>
          <SignInPage />
        </MeContext.Provider>,
        { route: "/sign-in" }
      );
      expect(getByText("Logging in...")).toBeTruthy();
    });

    it("should redirect to frontpage if user is already signed in", () => {
      const me = {
        id: "1",
        email: "squanchy@mail.com",
      };

      const { history } = render(
        <MeContext.Provider value={{ signOut, signIn, me, isSigningIn }}>
          <SignInPage />
        </MeContext.Provider>,
        { route: "/sign-in" }
      );
      expect(history.location.pathname).toBe("/");
    });
  });
});
