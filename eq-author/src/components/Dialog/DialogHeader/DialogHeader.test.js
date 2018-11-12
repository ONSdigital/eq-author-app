import React from "react";
import { shallow } from "enzyme";

import DialogHeader from "components/Dialog/DialogHeader/index";

describe("DialogHeader", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<DialogHeader>Dialog header content</DialogHeader>);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });
});
