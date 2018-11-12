import React from "react";
import { shallow } from "enzyme";

import { TableBody } from "components/DataTable/Elements";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableBody {...props} />);
};

describe("TableBody", () => {
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
