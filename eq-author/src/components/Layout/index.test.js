import React from "react";

import { render } from "tests/utils/rtl";
import { MeContext } from "App/MeContext";

import Layout from "./";

describe("Layout", () => {
  let props, me, signOut;
  beforeEach(() => {
    props = {
      title: "My title",
      children: <div>Contents</div>,
    };

    me = {
      id: "123",
      displayName: "Teri Dactyl",
      email: "not@Dinosaur.com",
    };
    signOut = jest.fn();
  });

  afterEach(() => {
    localStorage.removeItem("accessToken");
  });

  const renderLayoutWithContext = (props) =>
    render(
      <MeContext.Provider value={{ me, signOut }}>
        <Layout {...props} />
      </MeContext.Provider>
    );

  it("should show the title", () => {
    const { getByText } = renderLayoutWithContext(props);
    expect(getByText("My title")).toBeTruthy();
    expect(document.title).toEqual("My title");
  });

  it("should show the contents", () => {
    const { getByText } = renderLayoutWithContext(props);
    expect(getByText("Contents")).toBeTruthy();
  });

  it("should show the user profile when the user is logged in", async () => {
    const { getByText } = renderLayoutWithContext(props);

    expect(getByText("Teri Dactyl")).toBeTruthy();
  });
});
