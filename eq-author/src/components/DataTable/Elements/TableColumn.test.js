import React from "react";
import { shallow } from "enzyme";

import { TableColumn } from "./";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableColumn {...props} />);
};

describe("TableColumn", () => {
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
