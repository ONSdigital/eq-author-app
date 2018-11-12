import React from "react";
import { shallow } from "enzyme";
import ScrollPane from "./index";

describe("ScrollPane", () => {
  let component;

  beforeEach(() => {
    component = shallow(<ScrollPane>Children</ScrollPane>);
  });

  it("should render", () => {
    expect(component).toMatchSnapshot();
  });
});
