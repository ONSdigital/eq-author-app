import React from "react";
import { render } from "tests/utils/rtl";

import ContentPickerAccordionHeader from "components/ContentPicker/ContentPickerAccordionHeader";

import { colors } from "constants/theme";

const renderComponent = (props) =>
  render(
    <ContentPickerAccordionHeader {...props}>
      FooBar
    </ContentPickerAccordionHeader>
  );

describe("ContentPickerAccordionHeader", () => {
  let props;

  beforeEach(() => {
    props = {
      selected: false,
      disabled: false,
    };
  });

  it("should render", () => {
    expect(renderComponent(props).asFragment()).toMatchSnapshot();
  });

  it("should render with disabled styles", () => {
    const { getByText } = renderComponent({ disabled: true });
    expect(getByText("FooBar")).toHaveStyleRule("pointer-events", "none");
    expect(getByText("FooBar")).toHaveStyleRule("background", colors.grey);
  });

  it("should render with selected styles", () => {
    const { getByText } = renderComponent({ selected: true });
    expect(getByText("FooBar")).toHaveStyleRule("background", colors.blue);
  });
});
