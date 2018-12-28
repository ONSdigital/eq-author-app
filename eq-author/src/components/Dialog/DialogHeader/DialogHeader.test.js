import React from "react";
import { shallow } from "enzyme";

import DialogHeader from "./";

describe("DialogHeader", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DialogHeader>Dialog header content</DialogHeader>);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
