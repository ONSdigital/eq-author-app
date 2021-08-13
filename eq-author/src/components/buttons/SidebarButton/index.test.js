import React from "react";
import SidebarButton, { Detail, Title } from ".";
import { colors } from "constants/theme";
import { render } from "tests/utils/rtl";

describe("sidebarbutton", () => {
  it("should render sidebutton", () => {
    const { getByRole } = render(<SidebarButton />);
    getByRole("button");
  });

  it("should render sidebutton with error", () => {
    const { getByRole } = render(<SidebarButton hasError />);
    expect(getByRole("button")).toHaveStyle(
      `border-color: ${colors.errorPrimary}`
    );
  });
});

describe("Detail", () => {
  it("should render Detail", () => {
    const { getByText } = render(<Detail>Hello</Detail>);
    expect(getByText("Hello")).toBeTruthy();
  });
});

describe("Title", () => {
  it("should render Title", () => {
    const { getByText } = render(<Title>Hello</Title>);
    expect(getByText("Hello")).toBeTruthy();
  });
});
