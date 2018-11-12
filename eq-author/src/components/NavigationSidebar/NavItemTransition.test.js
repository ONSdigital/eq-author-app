import React from "react";
import { shallow } from "enzyme";

import NavItemTransition from "components/NavigationSidebar/NavItemTransition";

describe("components/NavigationSidebar/NavItemTransition", () => {
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
