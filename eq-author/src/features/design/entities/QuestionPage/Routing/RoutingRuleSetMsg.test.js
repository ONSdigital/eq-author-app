import React from "react";
import { shallow } from "enzyme";

import RoutingRuleSetMsg from "./RoutingRuleSetMsg";

let wrapper, props;

describe("components/RoutingRuleSetMsg", () => {
  let render = props => {
    wrapper = shallow(
      <RoutingRuleSetMsg {...props}>
        Ullamcorper Venenatis Fringilla
      </RoutingRuleSetMsg>
    );
  };

  it("should exclude add btn if no hander supplied", () => {
    props = {
      title: "Test"
    };
    render(props);
    expect(wrapper).toMatchSnapshot();
  });

  it("should allow adding a rule", () => {
    props = {
      onAddRuleSet: jest.fn(),
      title: "Test"
    };
    render(props);
    expect(wrapper).toMatchSnapshot();

    wrapper.find("[data-test='btn-add-rule']").simulate("click");
    expect(props.onAddRuleSet).toHaveBeenCalled();
  });
});
