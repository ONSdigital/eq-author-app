import React from "react";
import { PropertyPaneTitle } from "./";
import { shallow } from "enzyme";

let wrapper;

describe("PropertyPaneTitle", function() {
  beforeEach(() => {
    wrapper = shallow(<PropertyPaneTitle>Child</PropertyPaneTitle>);
  });
  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
