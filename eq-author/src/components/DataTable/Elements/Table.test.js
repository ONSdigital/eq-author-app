import React from "react";
import { shallow } from "enzyme";

import { Table } from "components/DataTable/Elements";

const createWrapper = (props = {}, render = shallow) => {
  return render(<Table {...props} />);
};

describe("Table", () => {
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
