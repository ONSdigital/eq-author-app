import React from "react";
import { shallow, mount } from "enzyme";
import ToggleChip from "components/ToggleChip";

const createWrapper = (props, render = shallow) => {
  return render(<ToggleChip {...props}>Test</ToggleChip>);
};

describe("ToggleChip", () => {
  let wrapper;
  let props;
  let handleChange;

  beforeEach(() => {
    handleChange = jest.fn();

    props = {
      id: "test",
      label: "Test chip",
      title: "Test chip",
      name: "test",
      onChange: handleChange,
      checked: false,
      value: "foo"
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render checked", () => {
    let wrapper = createWrapper({
      ...props,
      id: "chiptoggle-1",
      checked: true
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should call onChange when clicked", () => {
    const wrapper = createWrapper(props, mount);
    wrapper.find("input").simulate("change");
    expect(handleChange).toHaveBeenCalled();
  });
});
