import React from "react";
import { shallow } from "enzyme";
import Tooltip from ".";

describe("Tooltip", () => {
  it("should render", () => {
    const component = shallow(
      <Tooltip content="This is a button">
        <button id="buttonTooltip">Click me</button>
      </Tooltip>
    );

    expect(component).toMatchSnapshot();
  });

  it("should render arbitrary content", () => {
    const content = (
      <ul>
        <li>foo</li>
        <li>bar</li>
      </ul>
    );

    const component = shallow(
      <Tooltip content={content}>
        <button id="buttonTooltip">Click me</button>
      </Tooltip>
    );

    expect(component).toMatchSnapshot();
  });

  it("should use auto-generated id if one is not supplied", () => {
    const component = shallow(
      <Tooltip content="This is a tooltip">
        <button>Click me</button>
      </Tooltip>
    );

    expect(component).toMatchSnapshot();
  });

  it("should hide onClick", () => {
    jest.useFakeTimers();

    const originalOnClick = jest.fn();
    const wrapper = shallow(
      <Tooltip content="Special button">
        <button onClick={originalOnClick}>Click me</button>
      </Tooltip>
    );
    // Fake setting the ref
    wrapper.instance().tooltip = {
      tooltipRef: "ref",
    };
    wrapper.find("button").simulate("click");
    expect(wrapper.instance().tooltip).toMatchObject({
      tooltipRef: null,
    });
    expect(originalOnClick).toHaveBeenCalled();
  });
});
