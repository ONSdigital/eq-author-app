import React from "react";

import { render } from "tests/utils/rtl";

import NoSampleFileData from "./NoSampleFileData";

describe("No sample file data page", () => {
  const props = {
    onAddMetadata: jest.fn(),
  };

  it("should display no sample file data message", () => {
    const { getByText } = render(<NoSampleFileData {...props} />);
    expect(getByText("No sample file data found")).toBeTruthy();
  });

  it("should call onAddMetadata when add button clicked", () => {
    const { getByText } = render(<NoSampleFileData {...props} />);
    getByText("Add sample file data").click();

    expect(props.onAddMetadata).toHaveBeenCalled();
  });
});
