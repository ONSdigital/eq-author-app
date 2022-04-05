import React from "react";
import { render } from "tests/utils/rtl";
import Theme from "contexts/themeContext";

import CommentNotification from ".";

describe("Comment notification", () => {
  const setup = (props) =>
    render(
      <Theme>
        <CommentNotification {...props} data-test={"notification"} />
      </Theme>
    );

  describe("nav variant", () => {
    it("should render comment notification - nav variant", () => {
      const { getByTestId } = setup({ variant: "nav" });

      expect(getByTestId("notification")).toBeInTheDocument();
    });

    it("should display comment notification as neonYellow - nav variant", () => {
      const { getByTestId } = setup({ variant: "nav" });

      expect(getByTestId("notification")).toHaveStyleRule(
        "border-top",
        "1px solid #f0f762"
      );
    });
  });

  describe("tabs variant", () => {
    it("should render comment notification - tabs variant", () => {
      const { getByTestId } = setup({ variant: "tabs" });
      expect(getByTestId("notification")).toBeInTheDocument();
    });

    it("should display comment notification with correct padding top - tabs variant", () => {
      const { getByTestId } = setup({ variant: "tabs" });
      expect(getByTestId("notification")).toHaveStyleRule(
        "padding-top",
        "0.35rem"
      );
    });
  });
});
