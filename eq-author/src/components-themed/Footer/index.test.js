import React from "react";
import { render, screen } from "tests/utils/rtl";
import Footer from "components-themed/Footer";
import Theme from "contexts/themeContext";

describe("Footer in Components-themed", () => {
  const renderFooter = () =>
    render(
      <Theme themeName={"ons"}>
        <Footer centerCols={9} />
      </Theme>
    );

  describe("Footer", () => {
    it("should render", () => {
      const { getByTestId } = renderFooter();

      expect(getByTestId("footer")).toBeTruthy();
    });
  });
});
