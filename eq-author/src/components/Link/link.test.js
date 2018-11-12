import React from "react";
import { shallow } from "enzyme";
import Link from "components/Link";

describe("Link", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Link href={"#"} />);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
