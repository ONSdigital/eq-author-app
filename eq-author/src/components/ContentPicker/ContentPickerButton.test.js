import React from "react";
import { render } from "tests/utils/rtl";
import ContentPickerButton from "components/ContentPicker/ContentPickerButton";

const renderButton = (props) => render(<ContentPickerButton {...props} />);

describe("ContentPickerButton", () => {
  let props;
  beforeEach(() => {
    props = {
      hidden: false,
      selected: false,
      label: "foobar",
    };
  });

  it("should render without selected icon", () => {
    expect(renderButton().asFragment()).toMatchSnapshot();
  });

  it("should render with selected icon", () => {
    expect(
      renderButton({ ...props, selected: true }).asFragment()
    ).toMatchSnapshot();
  });

  it("should not render when hidden prop is true", () => {
    expect(
      renderButton({ ...props, hidden: true }).asFragment()
    ).toMatchSnapshot();
  });
});
