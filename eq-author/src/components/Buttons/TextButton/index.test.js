import React from "react";
import TextButton from "./";
import { shallow } from "enzyme";

describe("components/TextButton", () => {
  let wrapper;

  it("renders", () => {
    wrapper = shallow(<TextButton>TextButton</TextButton>);
    expect(wrapper).toMatchSnapshot();
  });
});
