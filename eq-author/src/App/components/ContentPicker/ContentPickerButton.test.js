import React from "react";
import { shallow } from "enzyme";
import ContentPickerButton from "App/components/ContentPicker/ContentPickerButton";

const render = props => shallow(<ContentPickerButton {...props} />);

describe("ContentPickerButton", () => {
  let wrapper, props;
  beforeEach(() => {
    props = {
      hidden: false,
      selected: false,
      label: "foobar"
    };

    wrapper = render(props);
  });

  it("should render without selected icon", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render with selected icon", () => {
    wrapper = render({ ...props, selected: true });
    expect(wrapper).toMatchSnapshot();
  });

  it("should not render when hidden prop is true", () => {
    wrapper = render({ ...props, hidden: true });
    expect(wrapper).toMatchSnapshot();
  });
});
