import React from "react";
import { shallow } from "enzyme";
import FieldWithInclude from "./FieldWithInclude";

const createWrapper = (props, render = shallow) => {
  return render(<FieldWithInclude {...props} />);
};

describe("FieldWithInclude", () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      children: <div>Children</div>,
      id: "1",
      name: "name",
      onChange: jest.fn(),
    };

    wrapper = createWrapper(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
