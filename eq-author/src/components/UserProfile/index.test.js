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

  it("should show the Sign Out button", () => {
    const { getByTestId } = renderWithContext(<UserProfile />);
    expect(getByTestId("signOut-btn")).toBeTruthy();
  });

  it("should trigger signOut", () => {
    const { getByTestId } = renderWithContext(<UserProfile />);

    fireEvent.click(getByTestId("signOut-btn"));

    expect(signOut).toHaveBeenCalled();
  });
});
