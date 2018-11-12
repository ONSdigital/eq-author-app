import React from "react";
import { shallow } from "enzyme";

import { TableRow } from "components/DataTable/Elements";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableRow {...props} />);
};

describe("TableRow", () => {
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
