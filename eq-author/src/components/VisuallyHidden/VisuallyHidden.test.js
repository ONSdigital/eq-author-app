import React from "react";
import { shallow } from "enzyme";
import VisuallyHidden from "./";

describe("VisuallyHidden", () => {
  let component;

  it("should render", () => {
    component = shallow(<VisuallyHidden>I am some hidden text</VisuallyHidden>);
    expect(component).toMatchSnapshot();
  });
});
