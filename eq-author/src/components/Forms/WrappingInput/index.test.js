import React from "react";
import { mount } from "enzyme";
import WrappingInput from ".";

describe("WrappingInput", () => {
  let component, handleChange, handleUpdate;

  beforeEach(() => {
    handleChange = jest.fn();
    handleUpdate = jest.fn();

    component = mount(
      <WrappingInput
        id="foo"
        value="123"
        onChange={handleChange}
        onBlur={handleUpdate}
      />
    );
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });

  it("will prevent new lines being inserted", () => {
    const ENTER_KEY = 13;
    const preventDefault = jest.fn();

    component.simulate("keyDown", {
      keyCode: 12,
      preventDefault,
    });

    expect(preventDefault).not.toHaveBeenCalled();

    component.simulate("keyDown", {
      keyCode: ENTER_KEY,
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalled();
  });
});
