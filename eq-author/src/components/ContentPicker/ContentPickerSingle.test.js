import React from "react";
import { shallow } from "enzyme";

import ContentPickerSingle, { PickerWrapper } from "./ContentPickerSingle";

describe("Content Picker Single", () => {
  let props;
  beforeEach(() => {
    props = {
      onTitleClick: jest.fn(),
      onOptionClick: jest.fn(),
      data: [
        { displayName: "Option 1", id: "1" },
        { displayName: "Option Label 2", id: "2" },
        { displayName: "Untitled Answer", id: "3" }
      ],
      selectedOption: "1",
      title: "Title",
      selected: false,
      open: false,
      hidden: false,
      disabled: false
    };
  });

  it("should render", () => {
    const wrapper = shallow(<ContentPickerSingle {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should not render when hidden", () => {
    const wrapper = shallow(<ContentPickerSingle {...props} hidden />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onTitleClick with id when title clicked", () => {
    const wrapper = shallow(<ContentPickerSingle {...props} />);
    wrapper.find("[data-test='picker-title']").simulate("click");
    expect(props.onTitleClick).toHaveBeenCalledWith();
  });

  it("should call onOptionClick with id and option when option is clicked", () => {
    const wrapper = shallow(<ContentPickerSingle {...props} />);
    wrapper
      .find("PickerOption")
      .at(1)
      .simulate("click");
    expect(props.onOptionClick).toHaveBeenCalledWith({
      displayName: "Option Label 2",
      id: "2"
    });
  });

  it("should render the option has disabled when there should be children", () => {
    const data = [
      { displayName: "Option 1", id: "1", children: ["someChild"] },
      { displayName: "Option Label 2", id: "2" }
    ];
    const wrapper = shallow(
      <ContentPickerSingle {...props} data={data} childKey="children" />
    );
    expect(
      wrapper
        .find("PickerOption")
        .at(0)
        .prop("disabled")
    ).toBe(false);
    expect(
      wrapper
        .find("PickerOption")
        .at(1)
        .prop("disabled")
    ).toBe(true);
  });

  describe("PickerWrapper", () => {
    it("should render", () => {
      const wrapper = shallow(<PickerWrapper />);
      expect(wrapper).toMatchSnapshot();
    });
    it("should render with additional styles when open", () => {
      const wrapper = shallow(<PickerWrapper open />);
      expect(wrapper).toMatchSnapshot();
    });
  });
});
