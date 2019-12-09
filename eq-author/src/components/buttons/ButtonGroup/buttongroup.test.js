import React from "react";
import ButtonGroup from ".";
import { render } from "tests/utils/rtl";

describe("button group component", () => {
  describe("snapshot", () => {
    it("Should not have changed inadvertently", () => {
      expect(render(<ButtonGroup />).asFragment()).toMatchSnapshot();
    });
  });

  describe("orientation", () => {
    it("is vertical by default", () => {
      const { getByTestId } = render(<ButtonGroup />);
      expect(getByTestId("button-group")).toHaveStyleRule(
        "flex-direction",
        "column"
      );
    });
    it("can be horizontal", () => {
      const { getByTestId } = render(<ButtonGroup horizontal />);
      expect(getByTestId("button-group")).toHaveStyleRule(
        "flex-direction",
        "row"
      );
    });
  });
});
