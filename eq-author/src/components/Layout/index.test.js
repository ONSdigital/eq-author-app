import React from "react";

import { render, flushPromises } from "tests/utils/rtl";

import { CURRENT_USER_QUERY } from "components/EditorLayout/Header";

import Layout from "./";

describe("Layout", () => {
  let props;
  beforeEach(() => {
    props = {
      title: "My title",
      children: <div>Contents</div>,
    };
  });

  afterEach(() => {
    localStorage.removeItem("accessToken");
  });

  it("should show the title", () => {
    const { getByText } = render(<Layout {...props} />);
    expect(getByText("My title")).toBeTruthy();
    expect(document.title).toEqual("My title");
  });

  it("should show the contents", () => {
    const { getByText } = render(<Layout {...props} />);
    expect(getByText("Contents")).toBeTruthy();
  });

  it("should show the user profile when the user is logged in", async () => {
    localStorage.setItem("accessToken", "some token");
    const mocks = [
      {
        request: {
          query: CURRENT_USER_QUERY,
        },
        result: {
          data: {
            me: {
              id: "1",
              displayName: "Rick Sanchez",
              picture: null,
              __typename: "User",
            },
          },
        },
      },
    ];
    const { queryByText, getByText } = render(<Layout {...props} />, { mocks });
    expect(queryByText("Rick Sanchez")).toBeFalsy();

    await flushPromises();

    expect(getByText("Rick Sanchez")).toBeTruthy();
  });
});
