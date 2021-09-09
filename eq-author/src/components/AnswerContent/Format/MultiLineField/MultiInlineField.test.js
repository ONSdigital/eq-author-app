import React from "react";
import { shallow } from "enzyme";

import MultiLineField from ".";

const createWrapper = (props = {}, render = shallow) => {
  return render(<MultiLineField {...props} />);
};

describe("MultiLineLabel", () => {
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
