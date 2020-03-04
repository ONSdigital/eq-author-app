import React from "react";
import { render, flushPromises, fireEvent } from "tests/utils/rtl";
import { MeProvider, CURRENT_USER_QUERY, withMe } from "./MeContext";
import waitForExpect from "wait-for-expect";
import auth from "components/Auth";
import {
  sendSentryError,
  setSentryTag,
  setSentryUser,
} from "../apollo/sentryUtils";

jest.mock("../apollo/sentryUtils");

const testUser = process.env.REACT_APP_TEST_ACCOUNT;
const testPass = process.env.REACT_APP_TEST_PASSWORD;

describe("MeContext", () => {
  describe("Queries", () => {
    let mocks, consoleError, mutationWasCalled, originalFetch;

    beforeAll(() => {
      /* 
      act is not currently dealing with async actions. This is resolved in React 16.9 which is currently in alpha.
      */
      /* eslint-disable  */
      consoleError = console.error;
      console.error = () => {};
      /* eslint-enable  */
    });
    afterAll(() => {
      //eslint-disable-next-line
      console.error = consoleError;
    });

    beforeEach(() => {
      originalFetch = window.fetch;

      window.fetch = jest.fn(() => Promise.resolve({ ok: true }));

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
                  admin: true,
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
      auth.signOut();
      window.fetch = originalFetch;
    });

    it("should run the user query if logged in on firebase and author", async () => {
      render(<MeProvider />, {
        mocks,
      });

      auth.signInWithEmailAndPassword(testUser, testPass);

      await waitForExpect(() => expect(mutationWasCalled).toEqual(true));
    });

    it("should not run the user query if not logged in on firebase and author", async () => {
      render(<MeProvider />, {
        mocks,
      });

      await flushPromises();
      expect(mutationWasCalled).toEqual(false);
    });
  });

  describe("sign in and out", () => {
    let user, originalFetch, fetchData, failFetch, consoleError;

    beforeAll(() => {
      /* 
      act is not currently dealing with async actions. This is resolved in React 16.9 which is currently in alpha.
      */
      /* eslint-disable  */
      consoleError = console.error;
      console.error = () => {};
      /* eslint-enable  */
    });
    afterAll(() => {
      //eslint-disable-next-line
      console.error = consoleError;
    });

    beforeEach(() => {
      fetchData = jest.fn(() => Promise.resolve({ ok: true }));

      failFetch = jest.fn(() => Promise.resolve({ ok: false, status: "500" }));

      originalFetch = window.fetch;
    });

    afterEach(() => {
      localStorage.clear();
      window.fetch = originalFetch;
    });

    const renderWithContext = () => render(<MeProvider />);

    it("Should sign the user in when they sign in on firebase.", async () => {
      window.fetch = fetchData;

      renderWithContext();

      await auth.signInWithEmailAndPassword(testUser, testPass);
      user = auth.currentUser;

      await waitForExpect(() => {
        expect(window.fetch).toHaveBeenCalledWith("/signIn", {
          method: "POST",
          headers: { authorization: expect.any(String) },
        });

        expect(localStorage.getItem("accessToken")).toEqual(user.ra);
        expect(localStorage.getItem("refreshToken")).toEqual(user.refreshToken);
      });
    });

    it("should report the error to sentry and remove the access token if the fetch fails", async () => {
      window.fetch = failFetch;
      renderWithContext();

      await auth.signInWithEmailAndPassword(testUser, testPass);
      user = auth.currentUser;

      await waitForExpect(() => {
        expect(window.fetch).toHaveBeenCalledWith("/signIn", {
          method: "POST",
          headers: { authorization: `Bearer ${user.ra}` },
        });

        expect(setSentryUser).toHaveBeenCalledWith(user.ra);
        expect(setSentryTag).toHaveBeenCalledWith("Signing in error");
        expect(sendSentryError).toHaveBeenCalledWith(
          new Error("Server responded with a 500 code.")
        );

        expect(localStorage.getItem("accessToken")).toEqual(null);
        expect(localStorage.getItem("refreshToken")).toEqual(null);
      });
    });

    it("Should sign the user out.", async () => {
      //eslint-disable-next-line react/prop-types
      const button = ({ signOut }) => (
        <button onClick={() => signOut()}>Sign out</button>
      );
      const Component = withMe(button);
      const { getByText, history } = render(
        <MeProvider>
          <Component />
        </MeProvider>
      );

      await auth.signInWithEmailAndPassword(testUser, testPass);

      expect(auth.currentUser).toBeTruthy();
      expect(localStorage.getItem("accessToken")).toBeTruthy();
      expect(localStorage.getItem("refreshToken")).toBeTruthy();

      fireEvent.click(getByText("Sign out"));

      waitForExpect(() => {
        expect(history.location.pathname).toMatch("/sign-in");

        expect(localStorage.getItem("accessToken")).toEqual(null);
        expect(localStorage.getItem("refreshToken")).toEqual(null);
      });
    });
  });
});
