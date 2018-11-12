import React from "react";
import { shallow } from "enzyme";

import { TableFoot } from "components/DataTable/Elements";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableFoot {...props} />);
};

describe("TableFoot", () => {
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
