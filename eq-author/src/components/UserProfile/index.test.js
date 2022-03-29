import React from "react";

import { render, fireEvent } from "tests/utils/rtl";

import { MeContext } from "App/MeContext";
import UserProfile from ".";

describe("UserProfile", () => {
  let me, signOut;

  beforeEach(() => {
    me = {
      id: "1",
      displayName: "Joe Bloggs",
      email: "Bloggs@Joe.com",
      picture: "http://foo.b.ar/photo.jpg",
      __typename: "User",
    };

    signOut = jest.fn();
  });

  const renderWithContext = (component) =>
    render(
      <MeContext.Provider value={{ me, signOut }}>
        {component}
      </MeContext.Provider>
    );

  it("should show the logged in user's display name", () => {
    const { getByText } = renderWithContext(<UserProfile />);
    expect(getByText(me.displayName)).toBeTruthy();
  });

  it("should trigger signOut", () => {
    const { getByText } = renderWithContext(<UserProfile />);

    fireEvent.click(getByText(me.displayName));

    expect(signOut).toHaveBeenCalled();
  });
});
