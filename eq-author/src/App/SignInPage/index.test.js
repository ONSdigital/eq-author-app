import React from "react";
import SignInPage from "App/SignInPage";
import { MeContext } from "App/MeContext";
import { shallow } from "enzyme";
import SignInForm from "./SignInForm";

describe("SignInPage", () => {
  let signIn, signOut;

  beforeEach(() => {
    signIn = jest.fn();
    signOut = jest.fn();
  });

  describe("signInPage", () => {
    it("should render", () => {
      const wrapper = shallow(
        <MeContext.Provider value={{ signOut, signIn }}>
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

    it("should update incompleteLoginAttempts if signIn throws", async () => {
      signIn = jest.fn(() => Promise.reject("500"));

      const wrapper = shallow(
        <MeContext.Provider value={{ signOut, signIn }}>
          <SignInPage />
        </MeContext.Provider>
      );

      const user = { ra: "foo", refreshToken: "bar" };

      const signinComponent = wrapper
        .dive()
        .dive()
        .dive();

      const signinCallback = signinComponent.find(SignInForm).prop("uiConfig")
        .callbacks.signInSuccessWithAuthResult;

      await signinCallback(user);

      expect(signinComponent.state("incompleteLoginAttempts")).toEqual(1);
    });
  });
});
