import React from "react";
import { render } from "tests/utils/rtl";
import Theme from "contexts/themeContext";

import CommentHighlight from ".";

describe("Comment notification", () => {
  const setup = (props) =>
    render(
      <Theme>
        <CommentHighlight {...props} />
      </Theme>
    );

  it("should render comment highlight", () => {
    const { getByTestId } = setup({ variant: "nav" });

    expect(getByTestId("comment-highlight")).toBeInTheDocument();
  });

  it("should display comment highlight with correct border styling", () => {
    const { getByTestId } = setup({ variant: "tabs" });
    expect(getByTestId("comment-highlight")).toHaveStyleRule(
      "border",
      "2px solid #f0f762"
    );
  });
});
