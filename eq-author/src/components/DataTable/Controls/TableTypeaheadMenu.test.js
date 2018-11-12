import React from "react";
import { shallow } from "enzyme";

import { TableTypeaheadMenu } from "components/DataTable/Controls";

const createWrapper = (props = {}, render = shallow) => {
  return render(<TableTypeaheadMenu {...props} />);
};

describe("TableTypeaheadMenu", () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      getMenuProps: jest.fn(),
      getItemProps: jest.fn()
    };

    wrapper = createWrapper(props, shallow);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
