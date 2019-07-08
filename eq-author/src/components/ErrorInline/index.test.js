import React from "react";
import { shallow } from "enzyme";
import ErrorInline from ".";

describe("ErrorInline", () => {
  it("should render", () => {
    const wrapper = shallow(<ErrorInline>Oops</ErrorInline>);
    expect(wrapper).toMatchSnapshot();
  });

  it("should not render if no message passed", () => {
    const wrapper = shallow(<ErrorInline />);
    expect(wrapper.children()).toHaveLength(0);
  });
});
