import React from "react";
import { shallow } from "enzyme";
import Date from "./index";

describe("Dummy/Date", () => {
  it("should render", () => {
    const wrapper = shallow(<Date />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render dd/mm/yyy", () => {
    const wrapper = shallow(<Date showDay showMonth showYear />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render mm/yyyy", () => {
    const wrapper = shallow(<Date showMonth showYear />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render yyyy", () => {
    const wrapper = shallow(<Date showYear />);
    expect(wrapper).toMatchSnapshot();
  });
});
