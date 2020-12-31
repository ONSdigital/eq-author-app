import React from "react";
import { shallow } from "enzyme";

import Routing from ".";

describe("questionConfirmation/Routing", () => {
  it("should render", () => {
    const wrapper = shallow(<Routing />);
    expect(wrapper).toMatchSnapshot();
  });
});
