import React from "react";
import { shallow } from "enzyme";

import PopupTransition from "components/NavigationSidebar/PopupTransition";

describe("components/PopupTransition", () => {
  it("should render", () => {
    expect(
      shallow(
        <PopupTransition>
          <div>Content</div>
        </PopupTransition>
      )
    ).toMatchSnapshot();
  });
});
