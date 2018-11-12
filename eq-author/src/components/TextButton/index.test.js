import React from "react";
import TextButton from "components/TextButton";
import { shallow } from "enzyme";

describe("components/TextButton", () => {
  let wrapper;

  it("renders", () => {
    wrapper = shallow(<TextButton>TextButton</TextButton>);
    expect(wrapper).toMatchSnapshot();
  });
});
