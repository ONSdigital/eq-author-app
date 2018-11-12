import React from "react";
import { shallow } from "enzyme";

import { colors } from "constants/theme";

import PickerOption from "./PickerOption";

describe("PickerOption", () => {
  const props = {
    onClick: jest.fn(),
    selected: false
  };
  it("should render", () => {
    const wrapper = shallow(<PickerOption {...props}>Option</PickerOption>);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as selected when selected", () => {
    const wrapper = shallow(
      <PickerOption {...props} selected>
        Option
      </PickerOption>
    );
    expect(wrapper).toHaveStyleRule("background", colors.primary);
  });
});
