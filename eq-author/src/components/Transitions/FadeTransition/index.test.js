import React from "react";
import { shallow } from "enzyme";

import FadeTransition from "./";

describe("components/FadeTransition", () => {
  it("should render", () => {
    expect(
      shallow(
        <FadeTransition>
          <div>Content</div>
        </FadeTransition>
      )
    ).toMatchSnapshot();
  });
});
