import React from "react";
import { shallow } from "enzyme";

import { AddRowButton } from "components/DataTable/Controls";

const createWrapper = (props = {}, render = shallow) => {
  return render(<AddRowButton {...props}>Button</AddRowButton>);
};

describe("AddRowButton", () => {
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
