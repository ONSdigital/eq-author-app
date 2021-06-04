import React from "react";

import { render } from "tests/utils/rtl";
import { colors } from "constants/theme";

import CollapsibleNavItem from ".";

const renderCollapsibleNavItem = ({
  title = "Sam Smith",
  titleUrl = "http://www.google.com",
  body = "<p>Diamonds<p>",
  ...rest
}) =>
  render(
    <CollapsibleNavItem title={title} titleUrl={titleUrl} {...rest}>
      {body}
    </CollapsibleNavItem>
  );

describe("Collapsible navigation item", () => {
  it("Should render", () => {
    const { getByTestId } = renderCollapsibleNavItem({});

    expect(getByTestId("CollapsibleNavItem")).toBeTruthy();
  });

  describe("Opening", () => {
    it("Should be able to default to open", () => {
      const { getByTestId } = renderCollapsibleNavItem({ open: true });

      expect(getByTestId("CollapsibleNavItem-body")).toBeVisible();
    });

    it("Should be able to open when the toggle button is clicked", () => {
      const { getByTestId } = renderCollapsibleNavItem({});

      expect(getByTestId("CollapsibleNavItem-body")).not.toBeVisible();

      getByTestId("CollapsibleNavItem-toggle-button").click();

      expect(getByTestId("CollapsibleNavItem-body")).toBeVisible();
    });
  });

  describe("Closing", () => {
    it("Should be able to default to closed", () => {
      const { getByTestId } = renderCollapsibleNavItem({});

      expect(getByTestId("CollapsibleNavItem-body")).not.toBeVisible();
    });

    it("Should be able to close when the toggle button is clicked", () => {
      const { getByTestId } = renderCollapsibleNavItem({ open: true });

      expect(getByTestId("CollapsibleNavItem-body")).toBeVisible();

      getByTestId("CollapsibleNavItem-toggle-button").click();

      expect(getByTestId("CollapsibleNavItem-body")).not.toBeVisible();
    });

    it("should show grey borders if closed, bordered & doesn't contain current page", () => {
      const { getByTestId } = renderCollapsibleNavItem({
        open: false,
        bordered: true,
        containsActiveEntity: false,
      });
      const button = getByTestId("CollapsibleNavItem-title");
      const style = `1px solid ${colors.grey}`;

      expect(button).toHaveStyleRule("border-bottom", style);
      expect(button).toHaveStyleRule("border-top", style);
    });

    it("should show orange borders if closed, bordered & contains current page", () => {
      const { getByTestId } = renderCollapsibleNavItem({
        open: false,
        bordered: true,
        containsActiveEntity: true,
      });

      const button = getByTestId("CollapsibleNavItem-title");
      const style = `1px solid ${colors.orange}`;

      expect(button).toHaveStyleRule("border-bottom", style);
      expect(button).toHaveStyleRule("border-top", style);
    });
  });

  describe("Error", () => {
    it("Should not show the error dot when there are no errors", () => {
      const { getByTestId } = renderCollapsibleNavItem({ open: true });

      expect(() => getByTestId("CollapsibleNavItem-error")).toThrow();

      getByTestId("CollapsibleNavItem-toggle-button").click();

      expect(() => getByTestId("CollapsibleNavItem-error")).toThrow();
    });

    it("Should show the error dot if the collapsible is closed and there are errors", () => {
      const { getByTestId } = renderCollapsibleNavItem({ childErrorCount: 1 });

      expect(getByTestId("CollapsibleNavItem-body")).not.toBeVisible();
      expect(getByTestId("CollapsibleNavItem-error")).toBeVisible();
    });

    it("Should not show the error dot if the collapsible is open and there are errors", () => {
      const { getByTestId } = renderCollapsibleNavItem({
        open: true,
        errorCount: 1,
      });

      expect(getByTestId("CollapsibleNavItem-body")).toBeVisible();
      expect(() => getByTestId("CollapsibleNavItem-error")).toThrow();
    });
  });
});
