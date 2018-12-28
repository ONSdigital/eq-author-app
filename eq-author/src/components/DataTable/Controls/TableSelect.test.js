import React from "react";
import { shallow } from "enzyme";

import { TableSelect } from "./";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableSelect {...props} />);
};

describe("TableSelect", () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {};

    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
