import React from "react";
import { shallow } from "enzyme";

import IntroductionLayout from "./IntroductionLayout";

describe("IntroductionLayout", () => {
  it("should render", () => {
    expect(
      shallow(
        <IntroductionLayout>
          <div />
        </IntroductionLayout>
      )
    ).toMatchSnapshot();
  });
});
