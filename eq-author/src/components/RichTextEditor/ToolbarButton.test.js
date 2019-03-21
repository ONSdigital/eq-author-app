import React from "react";

import ToolbarButton from "components/RichTextEditor/ToolbarButton";

import { mount } from "enzyme";

describe("ToolbarButton", () => {
  it("matches snapshot", () => {
    const wrapper = mount(<ToolbarButton title="button">Button</ToolbarButton>);
    expect(wrapper).toMatchSnapshot();
  });

  it("should style appropriately when active and canFocus", () => {
    const wrapper = mount(
      <ToolbarButton title="button" active canFocus>
        Button
      </ToolbarButton>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should style appropriately when disabled and canFocus is false", () => {
    const wrapper = mount(
      <ToolbarButton title="button" disabled>
        Button
      </ToolbarButton>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
