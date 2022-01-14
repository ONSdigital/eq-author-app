import React from "react";
import { shallow, mount } from "enzyme";
import Label from "./";
import { RadioLabel } from "components/Radio";

let wrapper;

describe("components/Forms/Label", () => {
  beforeEach(() => {
    wrapper = shallow(<Label>Name</Label>);
  });

  it("should render correctly", function () {
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

describe("components/Forms/Input", () => {
  let labelElement;

  beforeEach(() => {
    wrapper = shallow(<RadioLabel>Name</RadioLabel>);
  });

  it("should render correctly", function () {
    expect(wrapper).toMatchSnapshot();
  });

  it("should pass 'selected' prop to component", () => {
    wrapper = mount(<RadioLabel selected />);
    labelElement = wrapper.find("label").getElement();
    expect(labelElement.props.selected).toEqual(true);

    wrapper = mount(<RadioLabel selected={false} />);
    labelElement = wrapper.find("label").getElement();
    expect(labelElement.props.selected).toEqual(false);
  });
});
