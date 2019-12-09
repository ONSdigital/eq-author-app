import React from "react";
import { render } from "tests/utils/rtl";

import { TableInputDate } from "./";

describe("TableInputDate", () => {
  it("should render", () => {
    expect(render(<TableInputDate />).asFragment()).toMatchSnapshot();
  });
});
