import React from "react";
import { shallow } from "enzyme";

import DescribedText from "./";

describe("DescribedText", () => {
  it("should render with a text and description when description is provided", () => {
    const wrapper = shallow(
      <DescribedText description="I describe it">Label things</DescribedText>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as just text if no description provided", () => {
    const wrapper = shallow(<DescribedText>Label things</DescribedText>);
    expect(wrapper).toMatchSnapshot();
  });
});
