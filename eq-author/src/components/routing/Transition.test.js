import React from "react";
import { shallow } from "enzyme";

import Transition from "components/routing/Transition";

describe("components/routing/Transition", () => {
  it("should render", () => {
    expect(
      shallow(
        <Transition>
          <div>Content</div>
        </Transition>
      )
    ).toMatchSnapshot();
  });
});
