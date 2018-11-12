import React from "react";
import Button from "components/Button";
import { shallow } from "enzyme";

describe("components/Button", () => {
  let wrapper;

  it("renders according to variant", () => {
    wrapper = shallow(<Button variant="primary">Button</Button>);
    expect(wrapper).toMatchSnapshot();
    wrapper = shallow(<Button variant="secondary">Button</Button>);
    expect(wrapper).toMatchSnapshot();
    wrapper = shallow(<Button variant="tertiary">Button</Button>);
    expect(wrapper).toMatchSnapshot();
    wrapper = shallow(<Button variant="tertiary-light">Button</Button>);
    expect(wrapper).toMatchSnapshot();
  });

  it("renders as disabled", () => {
    wrapper = shallow(<Button disabled>Button</Button>);
    expect(wrapper).toMatchSnapshot();
  });
});
