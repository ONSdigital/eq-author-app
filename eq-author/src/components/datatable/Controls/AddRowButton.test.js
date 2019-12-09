import React from "react";
import { render } from "tests/utils/rtl";

import { AddRowButton } from "./";

describe("AddRowButton", () => {
  it("should render", () => {
    expect(
      render(<AddRowButton>Button</AddRowButton>).asFragment()
    ).toMatchSnapshot();
  });
});
