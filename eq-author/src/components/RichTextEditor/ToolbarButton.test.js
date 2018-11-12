import React from "react";

import ToolbarButton from "components/RichTextEditor/ToolbarButton";

import { mount } from "enzyme";

describe("ToolbarButton", () => {
  it("matches snapshot", () => {
    const wrapper = mount(<ToolbarButton title="button">Button</ToolbarButton>);
    expect(wrapper).toMatchSnapshot();
  });

  it("should style appropriately when active", () => {
    const wrapper = mount(
      <ToolbarButton title="button" active>
        Button
      </ToolbarButton>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
