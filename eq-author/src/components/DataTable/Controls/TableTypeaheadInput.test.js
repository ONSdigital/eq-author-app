import React from "react";
import { shallow } from "enzyme";

import { TableTypeaheadInput } from "components/DataTable/Controls";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableTypeaheadInput {...props} />);
};

describe("TableTypeaheadInput", () => {
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
