import React from "react";
import { shallow } from "enzyme";

import ContentPickerPanel from "App/components/ContentPicker/ContentPickerPanel";

describe("ContentPickerPanel", () => {
  const props = {
    id: "1",
    open: true,
    labelledBy: "some-label"
  };
  it("should render", () => {
    const wrapper = shallow(
      <ContentPickerPanel {...props}>Panel contents</ContentPickerPanel>
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("should not render when not open", () => {
    const wrapper = shallow(
      <ContentPickerPanel {...props} open={false}>
        Panel contents
      </ContentPickerPanel>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
