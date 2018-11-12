import React from "react";
import { shallow } from "enzyme";
import CharacterCounter from "components/CharacterCounter/index";

const createWrapper = (props = {}, render = shallow) => {
  return render(<CharacterCounter {...props} />);
};

describe("CharacterCounter", () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      value: "FooBar",
      limit: 25
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should update counter based on length of value", () => {
    wrapper = createWrapper({
      ...props,
      value: "FooBarFooBarFooBar"
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should update counter with negative count when limit exceeded", () => {
    wrapper = createWrapper({
      ...props,
      value: "FooBarFooBarFooBarFooBarFooBarFooBar"
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should handle null value", () => {
    wrapper = createWrapper({
      ...props,
      value: null
    });
    expect(wrapper).toMatchSnapshot();
  });
});
