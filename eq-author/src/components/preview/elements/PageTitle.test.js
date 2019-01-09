import { shallow } from "enzyme";
import React from "react";

import PageTitle from "./PageTitle";

describe("PageTitle", () => {
  it("should render", () => {
    const wrapper = shallow(<PageTitle title="foobar" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("should render a warning there is no title", () => {
    const wrapper = shallow(<PageTitle title="" />);
    expect(wrapper.find('[data-test="no-title"]')).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });
});
