import React from "react";
import { shallow } from "enzyme";

import ContentPickerAccordionHeader from "App/components/ContentPicker/ContentPickerAccordionHeader";

import { colors } from "constants/theme";

const render = props =>
  shallow(
    <ContentPickerAccordionHeader {...props}>
      FooBar
    </ContentPickerAccordionHeader>
  );

describe("ContentPickerAccordionHeader", () => {
  let wrapper, props;

  beforeEach(() => {
    props = {
      selected: false,
      disabled: false
    };
    wrapper = render(props);
  });

  it("should render", () => {
    expect(wrapper).toMatchSnapshot();
  });

  it("should render with disabled styles", () => {
    wrapper = render({ disabled: true });
    expect(wrapper).toHaveStyleRule("pointer-events", "none");
    expect(wrapper).toHaveStyleRule("background", colors.grey);
  });

  it("should render with selected styles", () => {
    wrapper = render({ selected: true });
    expect(wrapper).toHaveStyleRule("background", colors.blue);
  });
});
