import React from "react";
import { shallow } from "enzyme";

import IconGridButton from "./IconGridButton";

const mockFn = jest.fn();
let wrapper;

describe("components/IconGrid", function () {
  beforeEach(() => {
    wrapper = shallow(
      <IconGridButton
        iconSrc="checkbox.svg"
        title="Checkbox"
        onClick={mockFn}
      />
    );
  });

  it("will handle clicks", function () {
    wrapper.simulate("click");
    expect(mockFn).toHaveBeenCalled();
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
