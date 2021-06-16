import React from "react";

import { render } from "tests/utils/rtl";

import ContentCollapsible from ".";

const renderCollapsible = ({
  title = "Collapsible Title",
  defaultOpen = false,
  ...rest
}) =>
  render(
    <ContentCollapsible title={title} defaultOpen={defaultOpen} {...rest}>
      <p>Lorem ipsum</p>
    </ContentCollapsible>
  );

describe("Collapsible", () => {
  it("Can render", () => {
    const { getByTestId } = renderCollapsible({});

    expect(getByTestId("collapsible")).toBeTruthy();
  });

  describe("Opening", () => {
    it("Can default to open", () => {
      const { getByTestId } = renderCollapsible({ defaultOpen: true });

      expect(getByTestId("collapsible-body")).toBeVisible();
    });

    it("Can open when the toggle button is clicked", () => {
      const { getByTestId } = renderCollapsible({});

      expect(getByTestId("collapsible-body")).not.toBeVisible();

      getByTestId("collapsible-toggle-button").click();

      expect(getByTestId("collapsible-body")).toBeVisible();
    });

    it("Swaps the prefix to 'Hide' after the collapsible is opened", () => {
      const { getByTestId } = renderCollapsible({ showHide: true });

      expect(getByTestId("collapsible-toggle-button").textContent).toContain(
        "Show"
      );

      getByTestId("collapsible-toggle-button").click();

      expect(getByTestId("collapsible-toggle-button").textContent).toContain(
        "Hide"
      );
    });
  });

  describe("Closing", () => {
    it("Can default to closed", () => {
      const { getByTestId } = renderCollapsible({});

      expect(getByTestId("collapsible-body")).not.toBeVisible();
    });

    it("Can close when the toggle button is clicked", () => {
      const { getByTestId } = renderCollapsible({ defaultOpen: true });

      getByTestId("collapsible-toggle-button").click();

      expect(getByTestId("collapsible-body")).not.toBeVisible();
    });

    it("Can close when the hide button is clicked", () => {
      const { getByTestId } = renderCollapsible({ defaultOpen: true });

      getByTestId("collapsible-hide-button").click();

      expect(getByTestId("collapsible-body")).not.toBeVisible();
    });

    it("Swaps the prefix to 'Show' after the collapsible is closed", () => {
      const { getByTestId } = renderCollapsible({
        showHide: true,
        defaultOpen: true,
      });

      expect(getByTestId("collapsible-toggle-button").textContent).toContain(
        "Hide"
      );

      getByTestId("collapsible-toggle-button").click();

      expect(getByTestId("collapsible-toggle-button").textContent).toContain(
        "Show"
      );
    });
  });
});
