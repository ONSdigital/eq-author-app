import React from "react";
import { render } from "tests/utils/rtl";

import List from ".";

describe("FolderPicker list", () => {
  it("should render list", () => {
    const { getByTestId } = render(<List>Test</List>);

    expect(getByTestId("folder-picker-list")).toBeInTheDocument();
  });
});
