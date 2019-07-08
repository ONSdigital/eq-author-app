import React from "react";

import { render, fireEvent } from "tests/utils/rtl";
import flushPromises from "tests/utils/flushPromises";

import { signOutUser } from "redux/auth/actions";

import UserProfile, { CURRENT_USER_QUERY } from ".";

jest.mock("redux/auth/actions");

describe("UserProfile", () => {
  let me;

  beforeEach(() => {
    me = {
      id: "1",
      displayName: "Joe Bloggs",
      picture: "http://foo.b.ar/photo.jpg",
      __typename: "User",
    };
  });

  it("should show the logged in user's display name", async () => {
    const { getByText, queryByText } = render(<UserProfile />, {
      mocks: [
        {
          request: { query: CURRENT_USER_QUERY },
          result: { data: { me: me } },
        },
      ],
    });
    expect(queryByText(me.displayName)).toBeFalsy();
    await flushPromises();
    expect(getByText(me.displayName)).toBeTruthy();
  });

  it("should trigger signOut and clear the apollo cache on sign out", async () => {
    const fakeApolloClient = {
      resetStore: jest.fn(),
    };
    const { getByText } = render(<UserProfile client={fakeApolloClient} />, {
      mocks: [
        {
          request: { query: CURRENT_USER_QUERY },
          result: { data: { me: me } },
        },
      ],
    });
    await flushPromises();

    fireEvent.click(getByText(me.displayName));

    expect(signOutUser).toHaveBeenCalled();
    expect(fakeApolloClient.resetStore).toHaveBeenCalled();
  });
});
