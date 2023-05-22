import React from "react";
import { MeContext } from "App/MeContext";
import SignInPage from "App/SignInPage";
import { render, screen, act, waitFor } from "tests/utils/rtl";
import userEvent from "@testing-library/user-event";
import isCommonPassword from "./CommonPassword";
import config from "config";

jest.mock("./CommonPassword", () => jest.fn(() => Promise.resolve(false)));

describe("SignInPage", () => {
  let props;

  beforeEach(() => {
    props = {
      me: undefined,
      signIn: jest.fn(),
      signOut: jest.fn(),
      isSigningIn: false,
      sentEmailVerification: false,
      searchParams: "",
    };
    process.env.REACT_APP_VALID_EMAIL_DOMAINS = "";
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

    it("should setErrorMessage if location.search is not correct", () => {
      props = {
        ...props,
        searchParams: "mode=gobledeegoo",
      };
      const { getByText } = renderSignIn({ ...props });

      expect(getByText("Invalid mode code returned from link")).toBeTruthy();
    });

    it("should display error when email is empty", () => {
      const { getByTestId, getAllByText } = renderSignIn({
        ...props,
      });
      const btn = getByTestId("signIn-button");
      userEvent.click(btn);
      expect(getAllByText("Enter email")).toBeTruthy();
    });

    it("should display error when password is empty", () => {
      const { getByTestId, getAllByText } = renderSignIn({
        ...props,
      });

      const input = screen.getByLabelText("Email address");
      userEvent.type(input, "testEmail@ons.gov.uk");

      const btn = getByTestId("signIn-button");
      userEvent.click(btn);
      expect(getAllByText("Enter password")).toBeTruthy();
    });
  });

  describe("recover password page", () => {
    it("should display reset password component", () => {
      const { getByTestId, getByText } = renderSignIn({ ...props });

      const button = getByText("Forgot your password?");
      userEvent.click(button);

      expect(getByTestId("txt-recovery-email")).toBeVisible();
    });

    it("should display error when recover password Email is empty", () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Forgot your password?");
      userEvent.click(button);

      expect(getByTestId("txt-recovery-email")).toBeVisible();

      userEvent.click(screen.getByText("Send"));
      expect(getAllByText("Email should not be empty")).toBeTruthy();
    });

    it("should return to sign in form from recover password component", () => {
      const { getByText, getByTestId } = renderSignIn({
        ...props,
      });
      userEvent.click(screen.getByText("Forgot your password?"));
      expect(getByTestId("txt-recovery-email")).toBeVisible();

      userEvent.click(screen.getByText("Return to the sign in page"));
      expect(getByText("You must be signed in to access Author")).toBeTruthy();
    });
  });

  describe("reset Password page", () => {
    it("should render Error if Password reset link is faulty", async () => {
      props = {
        ...props,
        searchParams:
          "mode=resetPassword&oobCode=EpfWvpD2DTKoIHIp5pPfx5OXGml5baxIcVY7U8DBMe4AAAF",
      };
      act(() => {
        renderSignIn({ ...props });
      });

      expect(
        await screen.findByText(/This page has an error/)
      ).toBeInTheDocument();
    });
  });

  describe("verify email", () => {
    it("should render Error if verify email link expired or faulty", async () => {
      props = {
        ...props,
        searchParams:
          "mode=verifyEmail&oobCode=4WGfmkASqXN4bC-K1qFOBmRXp9UzMUFZFHakQ1AdzqcAAAF",
      };
      act(() => {
        renderSignIn({ ...props });
      });

      expect(
        await screen.findByText(/This page has an error/)
      ).toBeInTheDocument();
    });
  });

  describe("create account page", () => {
    it("should display create account component", () => {
      const { getByTestId, getByText } = renderSignIn({ ...props });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-fullName")).toBeVisible();
    });

    it("should display error when email is empty", async () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      userEvent.click(screen.getByText("Create account"));
      await waitFor(() => expect(getAllByText("Enter email")).toBeTruthy());
    });

    it("should display error when name is empty", async () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const input = screen.getByLabelText("Email address");
      userEvent.type(input, "testEmail@ons.gov.uk");

      userEvent.click(screen.getByText("Create account"));
      await waitFor(() => expect(getAllByText("Enter full name")).toBeTruthy());
    });

    it("should display error when password is empty", async () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const input = screen.getByLabelText("Email address");
      userEvent.type(input, "testEmail@ons.gov.uk");
      const input2 = screen.getByLabelText("First and last name");
      userEvent.type(input2, "My name is the best");

      userEvent.click(screen.getByText("Create account"));
      await waitFor(() => expect(getAllByText("Enter password")).toBeTruthy());
    });

    it("should display error when password is not long enough", async () => {
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const input = screen.getByLabelText("Email address");
      userEvent.type(input, "testEmail@ext.ons.gov.uk");
      const input2 = screen.getByLabelText("First and last name");
      userEvent.type(input2, "My name is the best");
      const input3 = screen.getByLabelText("Password");
      userEvent.type(input3, "faceboo");

      userEvent.click(screen.getByText("Create account"));
      await waitFor(() =>
        expect(
          getAllByText("Your password must be at least 8 characters.")
        ).toBeTruthy()
      );
    });

    it("should display error when email does not have valid domain", async () => {
      const { getByTestId, getByText, queryByText } = renderSignIn({
        ...props,
      });
      config.REACT_APP_VALID_EMAIL_DOMAINS = "@ons.gov.uk,@ext.ons.gov.uk";
      config.REACT_APP_ORGANISATION_ABBR = "ONS";

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const emailInput = screen.getByLabelText("Email address");
      userEvent.type(emailInput, "testEmail@test.com");
      const nameInput = screen.getByLabelText("First and last name");
      userEvent.type(nameInput, "My name is the best");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(passwordInput, "thispasswordisvalid");

      userEvent.click(screen.getByText("Create account"));
      await waitFor(() =>
        expect(queryByText("Enter a valid ONS email address")).toBeTruthy()
      );
    });

    it("should not display error when email has valid domain", async () => {
      const { getByTestId, getByText, queryByText } = renderSignIn({
        ...props,
      });
      config.REACT_APP_VALID_EMAIL_DOMAINS = "@ons.gov.uk,@ext.ons.gov.uk";
      config.REACT_APP_ORGANISATION_ABBR = "ONS";

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const emailInput = screen.getByLabelText("Email address");
      userEvent.type(emailInput, "testEmail2@ons.gov.uk");
      const nameInput = screen.getByLabelText("First and last name");
      userEvent.type(nameInput, "My name is the best");
      const passwordInput = screen.getByLabelText("Password");
      userEvent.type(passwordInput, "thispasswordisvalid");

      userEvent.click(screen.getByText("Create account"));
      await waitFor(() =>
        expect(queryByText("Enter a valid ONS email address")).toBeFalsy()
      );

      userEvent.type(emailInput, "");
      userEvent.type(emailInput, "testEmail2@ext.ons.gov.uk");

      await waitFor(() =>
        expect(queryByText("Enter a valid ONS email address")).toBeFalsy()
      );
    });

    it("should display error when password is not common", async () => {
      isCommonPassword.mockImplementation(jest.fn(() => Promise.resolve(true)));
      const { getByTestId, getByText, getAllByText } = renderSignIn({
        ...props,
      });

      const button = getByText("Create an Author account");
      userEvent.click(button);

      expect(getByTestId("txt-create-email")).toBeVisible();

      const input = screen.getByLabelText("Email address");
      userEvent.type(input, "testEmail@ons.gov.uk");
      const input2 = screen.getByLabelText("First and last name");
      userEvent.type(input2, "My name is the best");
      const input3 = screen.getByLabelText("Password");
      userEvent.type(input3, "facebook");

      userEvent.click(screen.getByText("Create account"));
      await waitFor(() =>
        expect(
          getAllByText("Common phrases and passwords are not allowed.")
        ).toBeTruthy()
      );
    });

    it("should return to sign in form from recover password form", () => {
      const { getByText, getByTestId } = renderSignIn({
        ...props,
      });
      userEvent.click(screen.getByText("Create an Author account"));
      expect(getByTestId("txt-create-email")).toBeVisible();

      userEvent.click(screen.getByText("sign in"));
      expect(getByText("You must be signed in to access Author")).toBeTruthy();
    });
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
          /You need to confirm your email address to sign in. Click on the confirmation link/
        )
      ).toBeTruthy();
    });
  });
});
