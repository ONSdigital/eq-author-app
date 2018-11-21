import React from "react";
import { shallow } from "enzyme";

import ContentPickerTitle, {
  TitleButton
} from "components/ContentPicker/ContentPickerTitle";

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
});
