import React from "react";
import { PropertyPane } from "./";
import { shallow } from "enzyme";

let wrapper;

describe("PropertyPane", function() {
  beforeEach(() => {
    wrapper = shallow(<PropertyPane>Child</PropertyPane>);
  });
  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
