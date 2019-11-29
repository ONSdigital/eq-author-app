import React from "react";
import { render } from "tests/utils/rtl";

import NavItemTransition from "./NavItemTransition";

describe("NavItemTransition", () => {
  it("should render", () => {
    expect(
      render(
        <NavItemTransition>
          <div>Content</div>
        </NavItemTransition>
      ).getByText("Content")
    ).toBeTruthy();
  });
});
