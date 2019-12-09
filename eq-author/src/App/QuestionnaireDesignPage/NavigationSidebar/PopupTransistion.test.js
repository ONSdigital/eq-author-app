import React from "react";
import { render } from "tests/utils/rtl";

import PopupTransition from "./PopupTransition";

describe("components/PopupTransition", () => {
  it("should render", () => {
    expect(
      render(
        <PopupTransition>
          <div>Content</div>
        </PopupTransition>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
