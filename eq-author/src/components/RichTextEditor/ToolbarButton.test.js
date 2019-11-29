import React from "react";
import { render } from "tests/utils/rtl";

import ToolbarButton from "components/RichTextEditor/ToolbarButton";
import { colors } from "constants/theme";

describe("ToolbarButton", () => {
  it("renders", () => {
    const { getByText } = render(
      <ToolbarButton title="button">Button</ToolbarButton>
    );
    expect(getByText("Button")).toBeTruthy();
  });

  it("should style appropriately when active and canFocus", () => {
    const { getByText } = render(
      <ToolbarButton title="button" active canFocus>
        Button
      </ToolbarButton>
    );
    expect(getByText("Button")).toHaveStyleRule("color", colors.black);
  });

  it("should style appropriately when disabled and canFocus is false", () => {
    const { getByText } = render(
      <ToolbarButton title="button" disabled>
        Button
      </ToolbarButton>
    );
    expect(getByText("Button")).toHaveAttribute("disabled");
  });
});
