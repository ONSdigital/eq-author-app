import React from "react";

import { render } from "tests/utils/rtl";

import NoMetadata from "./NoMetadata";

describe("No Metadata page", () => {
  const props = {
    onAddMetadata: jest.fn(),
  };

  it("should display no metadata message", () => {
    const { getByText } = render(<NoMetadata {...props} />);
    expect(getByText("No metadata found")).toBeTruthy();
  });

  it("should call onAddMetadata when add button clicked", () => {
    const { getByText } = render(<NoMetadata {...props} />);
    getByText("Add metadata").click();

    expect(props.onAddMetadata).toHaveBeenCalled();
  });
});
