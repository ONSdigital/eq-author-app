import React from "react";

import { render } from "tests/utils/rtl";

import NavItem from ".";

const renderNavItem = ({
  title = "Superstore",
  titleUrl = "http://www.google.com",
  ...rest
}) => render(<NavItem title={title} titleUrl={titleUrl} {...rest} />);

describe("Navigation item", () => {
  it("Can render", () => {
    const { getByTestId } = renderNavItem({});

    expect(getByTestId("NavItem")).toBeTruthy();
  });

  describe("Error", () => {
    it("Should not show the error badge if there are none", () => {
      const { queryByTestId } = renderNavItem({});

      expect(queryByTestId("NavItem-error")).toBeNull();
    });

    it("Should show the error badge if there are any", () => {
      const { getByTestId } = renderNavItem({ errorCount: 1 });

      expect(getByTestId("NavItem-error")).toBeVisible();
    });
  });
});
