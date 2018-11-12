import React from "react";
import { mount } from "enzyme";
import TextArea from "components/Forms/TextArea";

const defaultValue = "I am some text";

describe("components/Forms/TextArea", () => {
  let wrapper;
  let changeHandler;

  beforeEach(() => {
    changeHandler = jest.fn();
    wrapper = mount(
      <TextArea
        id="text"
        name="text"
        defaultValue={defaultValue}
        onChange={changeHandler}
      />
    );
  });

  it("should render correctly", function() {
    expect(wrapper).toMatchSnapshot();
  });

  it("should pass `defaultValue` prop to component when type=text", () => {
    expect(wrapper.props().defaultValue).toEqual(defaultValue);
  });
});
