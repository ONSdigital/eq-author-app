import React from "react";
import { shallow } from "enzyme";

import MoveButton from ".";

describe("MoveButton", () => {
  it("should render", () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <MoveButton onClick={handleClick}>Some content</MoveButton>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as disabled when disabled", () => {
    const wrapper = shallow(<MoveButton disabled>Some content</MoveButton>);
    expect(wrapper.props()).toMatchObject({
      "aria-disabled": true,
    });
  });

  it("should not call onClick when disabled", () => {
    const handleClick = jest.fn();
    const wrapper = shallow(
      <MoveButton onClick={handleClick} disabled>
        Some content
      </MoveButton>
    );
    expect(wrapper.props().onClick).toBeUndefined();
  });
});
