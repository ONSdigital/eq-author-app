import React from "react";
import { render, fireEvent, flushPromises } from "tests/utils/rtl";
import { MeProvider, CURRENT_USER_QUERY, withMe } from "./MeContext";
import {
  sendSentryError,
  setSentryTag,
  setSentryUser,
} from "../apollo/sentryUtils";

jest.mock("../apollo/sentryUtils");

describe("MeContext", () => {
  describe("Queries", () => {
    let mocks;
    let mutationWasCalled;

    beforeEach(() => {
      mutationWasCalled = false;
      mocks = [
        {
          request: {
            query: CURRENT_USER_QUERY,
          },
          result() {
            mutationWasCalled = true;
            return {
              data: {
                me: {
                  id: "123",
                  displayName: "Rob",
                  email: "Rob@Stark.com",
                  picture: "a//image_file.bmp",
                  __typename: "User",
                },
              },
            };
          },
        },
      ];
    });

    afterEach(() => {
      localStorage.clear();
    });

    it("should run the user query if the accessToken exists", async () => {
      localStorage.setItem("accessToken", "foo");
      render(<MeProvider />, {
        mocks,
      });
      await flushPromises();
      expect(mutationWasCalled).toEqual(true);
    });

    it("should not run the user query if the accessToken doesn't exist", async () => {
      render(<MeProvider />, {
        mocks,
      });
      await flushPromises();
      expect(mutationWasCalled).toEqual(false);
    });
  });

  describe("sign in and out", () => {
    let user,
      Component,
      originalFetch,
      fetchData,
      failFetch,
      WrappedComponent,
      consoleError,
      signInError;

    beforeEach(() => {
      /* 
      act is not currently dealing with async actions. This is resolved in React 16.9 which is currently in alpha.
      */
      /* eslint-disable no-console */
      consoleError = console.error;
      console.error = () => {};
      /* eslint-enable no-console */
      fetchData = jest.fn(() => Promise.resolve({ ok: true }));

      failFetch = jest.fn(() => Promise.resolve({ ok: false, status: "500" }));

      originalFetch = window.fetch;

      user = {
        ra: "accessToken",
        refreshToken: "refreshToken",
      };

      Component = props => (
        <div>
          {/* eslint-disable react/jsx-handler-names, react/prop-types*/}
          <button
            onClick={() =>
              props.signIn(user).catch(e => {
                signInError = e;
              })
            }
          >
            sign in
          </button>
          <button onClick={props.signOut}>sign out</button>
          {/* eslint-enable react/jsx-handler-names, react/prop-types*/}
        </div>
      );

      WrappedComponent = withMe(Component);
    });

    afterEach(() => {
      localStorage.clear();
      window.fetch = originalFetch;
      //eslint-disable-next-line no-console
      console.error = consoleError;
    });

    const renderWithContext = () =>
      render(
        <MeProvider>
          <WrappedComponent />
        </MeProvider>,
        {
          route: "/some-route",
        }
      );

    it("Should sign the user in.", () => {
      window.fetch = fetchData;

      const { getByText, history } = renderWithContext();

      fireEvent.click(getByText("sign in"));

      expect(window.fetch).toHaveBeenCalledWith("/signIn", {
        method: "POST",
        headers: { authorization: `Bearer ${user.ra}` },
      });

      expect(history.location.pathname).toMatch("/");

      expect(localStorage.getItem("accessToken")).toEqual(user.ra);
      expect(localStorage.getItem("refreshToken")).toEqual(user.refreshToken);
    });

    it("should report the error to sentry and remove the access token if the fetch fails", async () => {
      window.fetch = failFetch;
      const { getByText } = renderWithContext();

      fireEvent.click(getByText("sign in"));

      await flushPromises();

      expect(window.fetch).toHaveBeenCalledWith("/signIn", {
        method: "POST",
        headers: { authorization: `Bearer ${user.ra}` },
      });

      expect(setSentryUser).toHaveBeenCalledWith(user.ra);
      expect(setSentryTag).toHaveBeenCalledWith("Signing in error");
      expect(sendSentryError).toHaveBeenCalledWith(
        new Error("Server responded with a 500 code.")
      );

      expect(signInError).toEqual(
        new Error("Server responded with a 500 code.")
      );

      expect(localStorage.getItem("accessToken")).toEqual(null);
      expect(localStorage.getItem("refreshToken")).toEqual(null);
    });

    it("Should sign the user out.", () => {
      const { getByText, history } = renderWithContext();
      fireEvent.click(getByText("sign out"));

      expect(history.location.pathname).toMatch("/sign-in");

      expect(localStorage.getItem("accessToken")).toEqual(null);
      expect(localStorage.getItem("refreshToken")).toEqual(null);
    });
  });
});
