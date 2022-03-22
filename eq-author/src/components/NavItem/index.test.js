import React from "react";

import { render } from "tests/utils/rtl";
import Theme from "contexts/themeContext";

import NavItem from ".";

const renderNavItem = ({
  title = "Superstore",
  titleUrl = "http://www.google.com",
  ...rest
}) =>
  render(
    <Theme>
      <NavItem title={title} titleUrl={titleUrl} {...rest} />
    </Theme>
  );

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

  describe("Comment notification", () => {
    it("Should not show the comment notification icon if there are no unread comments", () => {
      const { queryByTestId } = renderNavItem({});

      expect(queryByTestId("comment-notification-nav")).toBeNull();
    });

    it("Should show the comment notification icon if there are unread comments", () => {
      const { getByTestId } = renderNavItem({ unreadComment: true });

      expect(getByTestId("comment-notification-nav")).toBeVisible();
    });
  });

  it("Should show the comment notification icon and error badge if there are both errors and unread comments", () => {
    const { getByTestId } = renderNavItem({
      errorCount: 1,
      unreadComment: true,
    });

    expect(getByTestId("comment-notification-nav")).toBeVisible();
    expect(getByTestId("NavItem-error")).toBeVisible();
  });
});
