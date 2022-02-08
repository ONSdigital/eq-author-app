import React from "react";
import { MeContext } from "App/MeContext";
import SignInPage from "App/SignInPage";
import { render, fireEvent, screen } from "tests/utils/rtl";

describe("SignInPage", () => {
  let props, signIn, signOut, isSigningIn, sentEmailVerification, location;

  beforeEach(() => {
    // signIn = jest.fn();
    // signOut = jest.fn();
    // isSigningIn = false;
    // sentEmailVerification = false;
    // location = { pathname: "/sign-in", search: "", hash: "" };

    props = {
      me: undefined,
      signIn: jest.fn(),
      signOut: jest.fn(),
      isSigningIn: false,
      sentEmailVerification: false,
      location: { pathname: "/sign-in", search: "", hash: "" },
    };
  });

  const renderSignIn = (props) =>
    render(
      <MeContext.Provider value={{ ...props }}>
        <SignInPage />
      </MeContext.Provider>,
      { route: "/sign-in" }
    );

  describe("signInPage", () => {
    it("should render", () => {
      const { getByText } = renderSignIn({ ...props });

      expect(getByText("You must be signed in to access Author")).toBeTruthy();
    });

    it("should load a loading page if currently signing in", () => {
      props = {
        ...props,
        isSigningIn: true,
      };

      const { getByTestId } = renderSignIn({ ...props });

      expect(getByTestId("loading")).toBeVisible();
      // expect(getByText("Logging you in...")).toBeTruthy();
    });

    it("should redirect to frontpage if user is already signed in", () => {
      const me = {
        id: "1",
        email: "squanchy@mail.com",
      };

      props = {
        ...props,
        me: me,
      };

      const { history } = renderSignIn({ ...props });
      expect(history.location.pathname).toBe("/");
    });
  });
});
