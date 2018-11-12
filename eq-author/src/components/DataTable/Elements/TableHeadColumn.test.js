import React from "react";
import { shallow } from "enzyme";

import { TableHeadColumn } from "components/DataTable/Elements";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableHeadColumn {...props} />);
};

describe("TableHeadColumn", () => {
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
