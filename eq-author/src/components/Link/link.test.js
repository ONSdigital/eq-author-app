import React from "react";
import { shallow } from "enzyme";
import Link from "./";

describe("Link", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Link href={"#"} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
