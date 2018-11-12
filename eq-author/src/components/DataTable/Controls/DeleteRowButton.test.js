import React from "react";
import { shallow } from "enzyme";

import { DeleteRowButton } from "components/DataTable/Controls";

const createWrapper = (props = {}, render = shallow) => {
  return render(<DeleteRowButton {...props} />);
};

describe("DeleteRowButton", () => {
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
