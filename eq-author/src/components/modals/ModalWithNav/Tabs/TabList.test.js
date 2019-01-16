import React from "react";
import { shallow } from "enzyme";

import TabList from "./TabList";

describe("Tab List", () => {
  const props = {
    title: "hello world",
  };

  it("should render the sidebar with title and children", () => {
    const wrapper = shallow(
      <TabList {...props}>
        <h1>hello</h1>
      </TabList>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
