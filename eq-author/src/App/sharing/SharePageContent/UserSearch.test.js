import React from "react";
import { render, fireEvent } from "tests/utils/rtl";

import UserSearch from "./UserSearch";

describe("Share Page", () => {
  let props;

  beforeEach(() => {
    props = {
      users: [
        { id: "4", name: "Fred", email: "Fred@mail.com" },
        { id: "5", name: "George", email: "George@mail.com" },
        { id: "6", name: "Albert", email: "Albert@mail.com" },
        { id: "7", name: "Fred Mercury", email: "Queen@mail.com" },
      ],
      onUserSelect: jest.fn(),
    };
  });

  it("should not be open initially", () => {
    const { getByRole } = render(<UserSearch {...props} />);
    const downshift = getByRole("combobox");
    expect(downshift.getAttribute("aria-expanded")).toBeTruthy();
  });

  it("should filter user list based on input", () => {
    const { queryByTestId, queryByRole, queryAllByRole } = render(
      <UserSearch {...props} />
    );
    const TARGET = "fred";
    const userSearch = queryByTestId("user-search");

    expect(userSearch.value).toEqual("");

    fireEvent.change(userSearch, {
      target: { value: TARGET },
    });

    expect(userSearch.value).toEqual(TARGET);

    const downshift = queryByRole("combobox");
    expect(downshift.getAttribute("aria-expanded")).toBeTruthy();
    expect(queryAllByRole("option").length).toBe(2);
  });

  it("should add user on submit", () => {
    const { queryByTestId, queryByRole } = render(<UserSearch {...props} />);
    const TARGET = "Geor";
    const userSearch = queryByTestId("user-search");

    expect(userSearch.value).toEqual("");

    fireEvent.change(userSearch, {
      target: { value: TARGET },
    });

    expect(userSearch.value).toEqual(TARGET);

    const downshift = queryByRole("combobox");
    const option = queryByRole("option");

    expect(downshift.getAttribute("aria-expanded")).toBeTruthy();
    expect(queryByRole("option")).toBeTruthy();

    fireEvent.click(option);
    expect(userSearch.value).toEqual("George");

    const submitButton = queryByTestId("editor-add-button");

    fireEvent.click(submitButton);
    expect(props.onUserSelect).toHaveBeenCalled();
  });
});
