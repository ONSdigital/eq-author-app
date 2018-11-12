import React from "react";
import { shallow } from "enzyme";
import MainCanvas from "./index";

describe("MainCanvas", () => {
  let component;

  beforeEach(() => {
    component = shallow(<MainCanvas>Children</MainCanvas>);
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });
});
