import React from "react";
import { shallow } from "enzyme";
import MenuButton from "components/SplitButton/MenuButton";

describe("SplitButton/MenuButton", () => {
  it("should render", () => {
    const wrapper = shallow(<MenuButton />);
    expect(wrapper).toMatchSnapshot();
  });
});
