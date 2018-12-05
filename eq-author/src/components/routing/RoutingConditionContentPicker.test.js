import React from "react";
import { shallow } from "enzyme";
import { UnwrappedRoutingConditionContentPicker } from "components/routing/RoutingConditionContentPicker";

const render = props =>
  shallow(<UnwrappedRoutingConditionContentPicker {...props} />);

describe("RoutingConditionContentPicker", () => {
  let wrapper, props;
  beforeEach(() => {
    props = {
      path: "foobar",
      onSubmit: jest.fn()
    };

    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
