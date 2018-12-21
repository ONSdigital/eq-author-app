import { colors } from "constants/theme";
import React from "react";
import { shallow } from "enzyme";
import CharacterCounter, { Counter } from "components/CharacterCounter";

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
    expect(wrapper.find(Counter)).toMatchSnapshot();
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

  it("should render correct style when limit exceeded", () => {
    wrapper = shallow(
      <Counter limit={10} value={"FooBarFooBarFooBarFooBarFooBarFooBar"} />
    );
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toHaveStyleRule("color", colors.red);
    expect(wrapper).not.toHaveStyleRule("color", colors.lightGrey);
  });

  it("should render correct style when limit not exceeded", () => {
    wrapper = shallow(<Counter {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toHaveStyleRule("color", colors.lightGrey);
    expect(wrapper).not.toHaveStyleRule("color", colors.red);
  });
});
