import React from "react";

import { render } from "tests/utils/rtl";

import Collapsible from ".";

const renderCollapsible = ({
  title = "Britney Spears",
  defaultOpen = false,
  ...rest
}) =>
  render(
    <Collapsible title={title} defaultOpen={defaultOpen} {...rest}>
      <p>Hit me baby, one more time.</p>
    </Collapsible>
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
  });
});
