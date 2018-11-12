import React from "react";
import { shallow } from "enzyme";
import PanelTitle from "components/Accordion/PanelTitle";

const createWrapper = (props, render = shallow) => {
  return render(<PanelTitle {...props}>This is a title</PanelTitle>);
};

describe("PanelTitle", () => {
  let wrapper;
  let handleClick;
  let props;

  beforeEach(() => {
    handleClick = jest.fn();
    props = {
      onClick: handleClick,
      controls: "panel-body-1",
      id: "panel-title-1",
      open: false
    };
    wrapper = createWrapper(props);
  });

  it("should render when not open", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render when open", () => {
    wrapper.setProps({
      open: true
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle click", () => {
    wrapper.find("button").simulate("click");
    expect(handleClick).toHaveBeenCalled();
  });
});
