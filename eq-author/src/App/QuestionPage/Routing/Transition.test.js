import React from "react";
import { shallow } from "enzyme";

import Transition from "App/QuestionPage/Routing/Transition";

describe("components/Routing/Transition", () => {
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
