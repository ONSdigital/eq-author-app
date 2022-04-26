import React from "react";
import { render } from "tests/utils/rtl";

import List from ".";

const setup = () => render(<List>Test</List>);

describe("SectionPicker list", () => {
  it("should render list", () => {
    const { getByTestId } = setup();

    expect(getByTestId("section-picker-list")).toBeInTheDocument();
  });
});
