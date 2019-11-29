import React from "react";
import { render } from "tests/utils/rtl";

import FadeTransition from "./";

describe("components/FadeTransition", () => {
  it("should render", () => {
    expect(
      render(
        <FadeTransition>
          <div>Content</div>
        </FadeTransition>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
