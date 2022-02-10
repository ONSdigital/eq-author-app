import React from "react";
import { render, screen } from "tests/utils/rtl";
import Footer from "components-themed/Footer";
import Theme from "contexts/themeContext";

describe("Footer in Components-themed", () => {
  const renderFooter = () =>
    render(
      <Theme themeName={"ons"}>
        <Footer centerCols={6} />
      </Theme>
    );

  it("should render", () => {
    renderFooter();
    expect(screen.queryByTestId("footer")).toBeTruthy();
    expect(screen.queryByTestId("footer")).toHaveStyle({
      "padding-left": "0",
    });
  });
});
