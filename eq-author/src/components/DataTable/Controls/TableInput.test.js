import React from "react";
import { shallow } from "enzyme";

import { TableInput } from "components/DataTable/Controls";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableInput {...props} />);
};

describe("TableInput", () => {
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
