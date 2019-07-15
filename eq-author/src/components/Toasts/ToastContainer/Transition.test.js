import React from "react";
import { shallow } from "enzyme";

import Transition from "./Transition";

describe("Toast Transition", () => {
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
