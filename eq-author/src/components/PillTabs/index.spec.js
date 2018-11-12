import React from "react";
import { shallow } from "enzyme";

import PillTabs from "./";
import { OPTIONS } from "./story";

describe("PillTabs", () => {
  const props = {
    value: "1",
    options: OPTIONS,
    onChange: () => {}
  };

  it("should render base tabs configured as per design", () => {
    const wrapper = shallow(
      <PillTabs value="1" options={OPTIONS} onChange={() => {}} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should render the button with title and applying the props", () => {
    const wrapper = shallow(<PillTabs {...props} />);
    const { buttonRender } = wrapper.find("BaseTabs").props();
    expect(
      shallow(buttonRender({ "aria-selected": true }, { title: "Custom" }))
    ).toMatchSnapshot();
  });
});
