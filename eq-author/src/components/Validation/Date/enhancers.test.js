import React from "react";
import { shallow } from "enzyme";

import { withProps, withPropRenamed, withPropRemapped } from "./enhancers";

describe("Enhancers", () => {
  const Component = "div";
  describe("withProps", () => {
    it("should partially apply the props passed so that a component can be curried", () => {
      const EnhancedComponent = withProps({ a: 1, b: 2 })(Component);
      const wrapper = shallow(<EnhancedComponent c={3} />);
      expect(wrapper.props()).toMatchObject({
        a: 1,
        b: 2,
        c: 3
      });
    });
  });

  describe("withPropRenamed", () => {
    it("should rename a prop to make it easy to combine enhancers", () => {
      const EnhancedComponent = withPropRenamed("a", "b")(Component);
      const wrapper = shallow(<EnhancedComponent a={1} />);
      expect(wrapper.props()).toMatchObject({
        b: 1
      });
    });
  });

  describe("withPropRemapped", () => {
    it("should rename and transform a function prop so it can match the api expected by another enhancer", () => {
      const EnhancedComponent = withPropRemapped(
        "onSpecificUpdate",
        "onUpdate",
        thing => `prefix-${thing}`
      )(Component);
      const onSpecificUpdateStub = jest.fn();
      const wrapper = shallow(
        <EnhancedComponent onSpecificUpdate={onSpecificUpdateStub} />
      );
      wrapper.props().onUpdate("hello");
      expect(onSpecificUpdateStub).toHaveBeenCalledWith("prefix-hello");
    });
  });
});
