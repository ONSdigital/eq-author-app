import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import { signOutUser } from "redux/auth/actions";

import UserProfile from ".";

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

  it("should show the logged in user's display name", () => {
    const { getByText } = render(
      <UserProfile
        data={{ me }}
        loading={false}
        client={{ resetStore: jest.fn() }}
      />
    );
    expect(getByText(me.displayName)).toBeTruthy();
  });

  it("should trigger signOut and clear the apollo cache on sign out", () => {
    const fakeApolloClient = {
      resetStore: jest.fn(),
    };
    const { getByText } = render(
      <UserProfile data={{ me }} loading={false} client={fakeApolloClient} />
    );

    fireEvent.click(getByText(me.displayName));

    expect(signOutUser).toHaveBeenCalled();
    expect(fakeApolloClient.resetStore).toHaveBeenCalled();
  });
});
