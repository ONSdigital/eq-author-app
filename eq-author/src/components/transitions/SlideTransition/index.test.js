import React from "react";
import { shallow } from "enzyme";

import SlideTransition from "./";

describe("components/SlideTransition", () => {
  it("should render", () => {
    expect(
      shallow(
        <SlideTransition>
          <div>Content</div>
        </SlideTransition>
      )
    ).toMatchSnapshot();
  });
});
