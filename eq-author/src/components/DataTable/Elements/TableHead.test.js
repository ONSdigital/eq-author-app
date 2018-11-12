import React from "react";
import { shallow } from "enzyme";

import { TableHead } from "components/DataTable/Elements";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableHead {...props} />);
};

describe("TableHead", () => {
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
