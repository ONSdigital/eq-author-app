import React from "react";
import SidebarButton, { Detail, Title } from "./index";
import { shallow } from "enzyme";

describe("SidebarButton", () => {
  it("should render", () => {
    const wrapper = shallow(
      <SidebarButton>
        <Title>Min value</Title>
        <Detail>0</Detail>
      </SidebarButton>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
