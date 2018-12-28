import React from "react";
import { shallow } from "enzyme";
import IconButtonDelete from "./";

describe("IconButtonDelete", () => {
  it("should pass on props", () => {
    const wrapper = shallow(
      <IconButtonDelete onClick={jest.fn()} anotherProp="test">
        Icon button text
      </IconButtonDelete>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should wrap in tooltip when text is hidden", () => {
    const wrapper = shallow(
      <IconButtonDelete onClick={jest.fn()} hideText>
        Icon button text
      </IconButtonDelete>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
