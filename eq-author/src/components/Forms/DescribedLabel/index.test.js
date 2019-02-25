import React from "react";
import { shallow } from "enzyme";

import DescribedLabel from "./";

describe("DescribedLabel", () => {
  it("should render with a label and description when description is provided", () => {
    const wrapper = shallow(
      <DescribedLabel description="I describe it">Label things</DescribedLabel>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as just a label if no description provided", () => {
    const wrapper = shallow(<DescribedLabel>Label things</DescribedLabel>);
    expect(wrapper).toMatchSnapshot();
  });
});
