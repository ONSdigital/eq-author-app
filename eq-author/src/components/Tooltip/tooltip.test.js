import React from "react";
import { shallow } from "enzyme";
import Tooltip from "./index";

describe("Tooltip", () => {
  let component;

  it("should render", () => {
    component = shallow(
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

    component = shallow(
      <Tooltip content={content}>
        <button id="buttonTooltip">Click me</button>
      </Tooltip>
    );

    expect(component).toMatchSnapshot();
  });

  it("should use auto-generated id if one is not supplied", () => {
    component = shallow(
      <Tooltip content="This is a tooltip">
        <button>Click me</button>
      </Tooltip>
    );

    expect(component).toMatchSnapshot();
  });
});
