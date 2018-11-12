import React from "react";
import { shallow } from "enzyme";

import Transition from "components/Toast/Transition";

describe("components/Toast/Transition", () => {
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
