import React from "react";
import { render } from "tests/utils/rtl";
import Theme from "contexts/themeContext";

import CommentHighlight from ".";

describe("Comment notification", () => {
  const setup = () =>
    render(
      <Theme>
        <CommentHighlight>Content</CommentHighlight>
      </Theme>
    );

  it("should render comment highlight", () => {
    const { getByTestId } = setup();

    expect(getByTestId("comment-highlight")).toBeInTheDocument();
  });

  it("should display comment highlight with correct border styling", () => {
    const { getByTestId } = setup();
    expect(getByTestId("comment-highlight")).toHaveStyleRule(
      "border",
      "2px solid #f0f762"
    );
  });
});
