import React from "react";
import { shallow } from "enzyme";

import UnitInput, { Type } from "./UnitInput";

describe("UnitInput", () => {
  it("should render with a unit", () => {
    const wrapper = shallow(<UnitInput unit="£" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as trailing when necessary", () => {
    const wrapper = shallow(<UnitInput unit="%" trailing />);
    expect(wrapper.find(Type).props()).toMatchObject({
      trailing: true,
    });
  });
});

describe("Type", () => {
  it("should be positioned at the start with left border radius", () => {
    const wrapper = shallow(<Type />);
    expect(wrapper).toHaveStyleRule("left", "0");
    expect(wrapper).toHaveStyleRule("border-radius", "3px 0 0 3px");
  });

  it("should be positioned at the start with right border radius", () => {
    const wrapper = shallow(<Type trailing />);
    expect(wrapper).toHaveStyleRule("right", "0");
    expect(wrapper).toHaveStyleRule("border-radius", "0 3px 3px 0");
  });
});
