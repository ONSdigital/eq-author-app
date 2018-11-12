import React from "react";
import { UnconnectedSignInPage as SignInPage, mapStateToProps } from "./index";
import { shallow } from "enzyme";

describe("SignInPage", () => {
  describe("Component", () => {
    let verifyAuthStatus, signInUser;

    beforeEach(() => {
      verifyAuthStatus = jest.fn();
      signInUser = jest.fn();
    });

    const render = (props = {}) =>
      shallow(
        <SignInPage
          verifyAuthStatus={verifyAuthStatus}
          signInUser={signInUser}
          verifiedAuthStatus={false}
          isSignedIn={false}
          {...props}
        />
      );

    describe("when auth state yet to be determined", () => {
      it("should render nothing", () => {
        expect(render()).toMatchSnapshot();
      });

      it("should listen for auth state changes", () => {
        render();
        expect(verifyAuthStatus).toHaveBeenCalled();
      });
    });

    describe("when the user lands on the page and is already logged in", () => {
      it("should not listen to auth state changes", () => {
        render({ isSignedIn: true, verifiedAuthStatus: true });
        expect(verifyAuthStatus).not.toHaveBeenCalled();
      });

      it("should redirect user to where they came from", () => {
        const wrapper = render({
          isSignedIn: true,
          verifiedAuthStatus: true,
          returnURL: "/foo"
        });

        expect(wrapper).toMatchSnapshot();
      });

      it("if they don't have a returnURL should return to root", () => {
        const wrapper = render({
          isSignedIn: true,
          verifiedAuthStatus: true
        });

        expect(wrapper).toMatchSnapshot();
      });
    });

    describe("when un-mounting", () => {
      let unsubscribe;

      beforeEach(() => {
        unsubscribe = jest.fn();
        verifyAuthStatus.mockImplementation(() => unsubscribe);
      });

      it("should unsubscribe from auth changes", () => {
        const wrapper = render();
        wrapper.unmount();
        expect(unsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe("mapStateToProps", () => {
    it("does the right thing", () => {
      const auth = {
        user: {},
        verifiedStatus: false
      };
      const location = {
        state: { returnURL: "/foobar" }
      };

      const result = mapStateToProps({ auth }, { location });

      expect(result).toEqual({
        isSignedIn: true,
        verifiedAuthStatus: false,
        returnURL: "/foobar"
      });
    });
  });
});
