import React from "react";
import { shallow } from "enzyme";

import withProps from "./withProps";

describe("withProps", () => {
  const Component = "div";

  it("should partially apply the props passed so that a component can be curried", () => {
    const EnhancedComponent = withProps({ a: 1, b: 2 })(Component);
    const wrapper = shallow(<EnhancedComponent c={3} />);
    expect(wrapper.props()).toMatchObject({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});
