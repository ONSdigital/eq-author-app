import React from "react";
import { shallow } from "enzyme";

import withPropRemapped from "./withPropRemapped";

describe("withPropRemapped", () => {
  const Component = "div";

  it("should rename and transform a function prop so it can match the api expected by another enhancer", () => {
    const EnhancedComponent = withPropRemapped(
      "onSpecificUpdate",
      "onUpdate",
      (thing) => `prefix-${thing}`
    )(Component);
    const onSpecificUpdateStub = jest.fn();
    const wrapper = shallow(
      <EnhancedComponent onSpecificUpdate={onSpecificUpdateStub} />
    );
    wrapper.props().onUpdate("hello");
    expect(onSpecificUpdateStub).toHaveBeenCalledWith("prefix-hello");
  });
});
