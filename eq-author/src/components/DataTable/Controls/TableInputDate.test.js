import React from "react";
import { shallow } from "enzyme";

import { TableInputDate } from "components/DataTable/Controls";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableInputDate {...props} />);
};

describe("TableInputDate", () => {
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
