import React from "react";
import { IconGrid } from "./";
import { shallow } from "enzyme";

let wrapper;

describe("IconGrid", function () {
  beforeEach(() => {
    wrapper = shallow(<IconGrid>Child</IconGrid>);
  });
  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
