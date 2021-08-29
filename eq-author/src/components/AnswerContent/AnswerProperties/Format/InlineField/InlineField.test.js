import React from "react";
import { shallow } from "enzyme";

import InlineField from ".";

const createWrapper = (props = {}, render = shallow) => {
  return render(<InlineField {...props} />);
};

describe("InlineLabel", () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      id: "1",
      label: "Label",
      children: <input type="text" />,
    };
    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
