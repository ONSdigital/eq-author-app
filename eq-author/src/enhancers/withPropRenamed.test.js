import React from "react";
import { shallow } from "enzyme";

import withPropRenamed from "./withPropRenamed";

describe("withPropRemapped", () => {
  const Component = "div";

  it("should rename a prop to make it easy to combine enhancers", () => {
    const EnhancedComponent = withPropRenamed("a", "b")(Component);
    const wrapper = shallow(<EnhancedComponent a={1} />);
    expect(wrapper.props()).toMatchObject({
      b: 1,
    });
  });
});
