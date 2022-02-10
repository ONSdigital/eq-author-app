import React from "react";
import { MeContext } from "App/MeContext";
import SignInPage from "App/SignInPage";
import { render, screen, fireEvent } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import auth from "components/Auth";
import waitForExpect from "wait-for-expect";

const testUser = process.env.REACT_APP_TEST_ACCOUNT;
const testPass = process.env.REACT_APP_TEST_PASSWORD;

describe("SignInPage", () => {
  let props, mutationWasCalled;

  beforeEach(() => {
    props = {
      me: undefined,
      signIn: jest.fn(),
      signOut: jest.fn(),
      isSigningIn: false,
      sentEmailVerification: false,
      location: { pathname: "/sign-in", search: "", hash: "" },
    };

    mutationWasCalled = false;
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

    // it.only("should show success if Password is updated", () => {
    //   props = {
    //     ...props,
    //     emailNowVerified: true,
    //   };
    //   const { getByText } = renderSignIn({ ...props });

    //   expect(
    //     getByText("You've successfully verified your Author account.")
    //   ).toBeTruthy();
    // });

    it("should setErrorMessage if location.search is not correct", () => {
      props = {
        ...props,
        location: { pathname: "/sign-in", search: "gobledeegoo", hash: "" },
      };
      const { getByText } = renderSignIn({ ...props });

      expect(getByText("Invalid mode code returned from link")).toBeTruthy();
    });

    // it.only("should display error when email is empty", () => {
    //   const { getByRole, getAllByText } = renderSignIn({
    //     ...props,
    //   });
    //   const btn = getByRole("button", { name: /sign-in/i });
    //   userEvent.click(btn);
    //   expect(getAllByText("Enter email")).toBeTruthy();
    // });
  });

  describe("recovery password page", () => {
    it("should display recover password component", () => {
      const { getByTestId, getByText } = renderSignIn({ ...props });

      const button = getByText("Forgot your password?");
      userEvent.click(button);

      expect(getByTestId("txt-recovery-email")).toBeVisible();
    });

    it("should display error when recover password is empty", () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Forgot your password?");
      userEvent.click(button);

      expect(getByTestId("txt-recovery-email")).toBeVisible();

      userEvent.click(screen.getByText("Send"));
      expect(getAllByText("Email should not be empty")).toBeTruthy();
    });

    it("should return to sign in form from recover password form", () => {
      const { getByText, getByTestId } = renderSignIn({
        ...props,
      });
      userEvent.click(screen.getByText("Forgot your password?"));
      expect(getByTestId("txt-recovery-email")).toBeVisible();

      userEvent.click(screen.getByText("Return to the sign in page"));
      expect(getByText("You must be signed in to access Author")).toBeTruthy();
    });

    // it.only("should send a password reset request to firebase", async () => {
    //   const { getByText, getByTestId } = renderSignIn({
    //     ...props,
    //   });
    //   userEvent.click(screen.getByText("Forgot your password?"));
    //   expect(getByTestId("txt-recovery-email")).toBeVisible();

    //   const input = screen.getByLabelText("Enter your email address");

    //   userEvent.type(input, "nemazine@hotmail.com");

    //   await waitForExpect(() => fireEvent.click(screen.getByText("Send")));
    //   // await waitForExpect(() => expect(mutationWasCalled).toEqual(false));
    //   screen.debug();
    //   expect(
    //     getByText("We've sent a link for resetting your password to:")
    //   ).toBeTruthy();
    // });
  });

  describe("create account page", () => {
    it("should display create account component", () => {
      const { getByTestId, getByText } = renderSignIn({ ...props });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-fullName")).toBeVisible();
    });

    it("should display error when email is empty", () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      userEvent.click(screen.getByText("Create account"));
      expect(getAllByText("Enter email")).toBeTruthy();
    });

    it("should display error when name is empty", () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const input = screen.getByLabelText("Email address");
      userEvent.type(input, "testEmail@test.com");

      userEvent.click(screen.getByText("Create account"));
      expect(getAllByText("Enter full name")).toBeTruthy();
    });

    it("should display error when password is empty", () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const input = screen.getByLabelText("Email address");
      userEvent.type(input, "testEmail@test.com");
      const input2 = screen.getByLabelText("First and last name");
      userEvent.type(input2, "My name is the best");

      userEvent.click(screen.getByText("Create account"));
      expect(getAllByText("Enter password")).toBeTruthy();
    });

    // it.only("should display error when password is less than 6 chars", async () => {
    //   const { getByTestId, getByText, getAllByText } = renderSignIn({
    //     ...props,
    //   });

    //   const button = getByText("Create an Author account");
    //   userEvent.click(button);

    //   expect(getByTestId("txt-create-email")).toBeVisible();

    //   const input = screen.getByLabelText("Email address");
    //   userEvent.type(input, "testEmail@test.com");
    //   const input2 = screen.getByLabelText("First and last name");
    //   userEvent.type(input2, "My name is the best");
    //   const input3 = screen.getByLabelText("Password");
    //   userEvent.type(input3, "12345");

    //   userEvent.click(screen.getByText("Create account"));
    //   screen.debug();
    //   expect(
    //     getAllByText("Password should be at least 6 characters")
    //   ).toBeTruthy();
    // });

    it("should return to sign in form from recover password form", () => {
      const { getByText, getByTestId } = renderSignIn({
        ...props,
      });
      userEvent.click(screen.getByText("Create an Author account"));
      expect(getByTestId("txt-create-email")).toBeVisible();

      userEvent.click(screen.getByText("sign in"));
      expect(getByText("You must be signed in to access Author")).toBeTruthy();
    });

    // it.only("should send a password reset request to firebase", async () => {
    //   const { getByText, getByTestId } = renderSignIn({
    //     ...props,
    //   });
    //   userEvent.click(screen.getByText("Create an Author account"));
    //   expect(getByTestId("txt-recovery-email")).toBeVisible();

    //   const input = screen.getByLabelText("Enter your email address");

    //   userEvent.type(input, "nemazine@hotmail.com");

    //   fireEvent.click(screen.getByText("Send"));
    //   await waitForExpect(() => expect(mutationWasCalled).toEqual(false));
    //   screen.debug();
    //   expect(
    //     getByText("We've sent a link for resetting your password to:")
    //   ).toBeTruthy();
    // });
  });

  describe("email validation page", () => {
    it("should display email validation component", () => {
      props = {
        ...props,
        sentEmailVerification: true,
      };
      const { getByText } = renderSignIn({ ...props });

      expect(
        getByText(
          "You need to confirm your email address to sign in. Click on the confirmation link we've emailed to:"
        )
      ).toBeTruthy();
    });
  });
});
