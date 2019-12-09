import React from "react";
import { render } from "tests/utils/rtl";

import { colors } from "constants/theme";

import PickerOption from "components/ContentPicker/PickerOption";

describe("PickerOption", () => {
  const props = {
    onClick: jest.fn(),
    selected: false,
  };
  it("should render", () => {
    expect(
      render(<PickerOption {...props}>Option</PickerOption>).asFragment()
    ).toMatchSnapshot();
  });

  it("should render as selected when selected", () => {
    const { getByText } = render(
      <PickerOption {...props} selected>
        Option
      </PickerOption>
    );
    expect(getByText("Option")).toHaveStyleRule("background", colors.primary);
  });
});
