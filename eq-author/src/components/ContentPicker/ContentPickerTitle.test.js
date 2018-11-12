import React from "react";
import { shallow } from "enzyme";

import { colors } from "constants/theme";

import ContentPickerTitle, { TitleButton } from "./ContentPickerTitle";

describe("Content Picker Title", () => {
  let props = {};
  beforeEach(() => {
    props = {
      id: "id",
      onClick: jest.fn(),
      selected: true,
      open: true,
      disabled: false
    };
  });

  it("should render", () => {
    const wrapper = shallow(
      <ContentPickerTitle {...props}>Hello</ContentPickerTitle>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should attach onClick to the title", () => {
    const wrapper = shallow(
      <ContentPickerTitle {...props}>Hello</ContentPickerTitle>
    );
    wrapper.find(TitleButton).simulate("click", "something");
    expect(props.onClick).toHaveBeenCalledWith("something");
  });

  describe("TitleButton", () => {
    it("should render with disabled styles", () => {
      const wrapper = shallow(<TitleButton disabled>Hello</TitleButton>);
      expect(wrapper).toHaveStyleRule("pointer-events", "none");
    });

    it("should render with selected styles", () => {
      const wrapper = shallow(<TitleButton selected>Hello</TitleButton>);
      expect(wrapper).toHaveStyleRule("background", colors.darkBlue);
    });
  });
});
