import React from "react";
import { shallow } from "enzyme";

import Error from "./Error";

describe("Error", () => {
  it("should render", () => {
    const wrapper = shallow(<Error />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as large", () => {
    const wrapper = shallow(<Error large />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render as small", () => {
    const wrapper = shallow(<Error small />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render with no margin", () => {
    const wrapper = shallow(<Error margin={false} />);
    expect(wrapper).toMatchSnapshot();
  });
});
