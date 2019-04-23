import React from "react";
import { shallow } from "enzyme";
import { Titled } from "react-titled";

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

  it("should apply introduction to the title", () => {
    const titleFunc = shallow(
      <IntroductionLayout>
        <div />
      </IntroductionLayout>
    )
      .find(Titled)
      .prop("title");

    expect(titleFunc("Something")).toEqual("Introduction — Something");
  });
});
