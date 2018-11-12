import React from "react";
import { shallow } from "enzyme";
import Label from "components/Forms/Label";

let wrapper;

describe("components/Forms/Label", () => {
  beforeEach(() => {
    wrapper = shallow(<Label>Name</Label>);
  });

  it("should render correctly", function() {
    expect(wrapper).toMatchSnapshot();
  });

  it("should pass on arbitrary props", () => {
    wrapper = shallow(
      <Label foo="bar" bar="foo">
        Foo
      </Label>
    );
    expect(wrapper.props().foo).toEqual("bar");
    expect(wrapper.props().bar).toEqual("foo");
  });
});
