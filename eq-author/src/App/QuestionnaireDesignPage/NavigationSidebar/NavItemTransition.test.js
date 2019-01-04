import React from "react";
import { shallow } from "enzyme";

import NavItemTransition from "./NavItemTransition";

describe("NavItemTransition", () => {
  it("should render", () => {
    expect(
      shallow(
        <NavItemTransition>
          <div>Content</div>
        </NavItemTransition>
      )
    ).toMatchSnapshot();
  });
});
