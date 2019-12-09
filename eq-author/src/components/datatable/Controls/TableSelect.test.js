import React from "react";
import { render } from "tests/utils/rtl";

import { TableSelect } from "./";

describe("TableSelect", () => {
  it("should render", () => {
    expect(render(<TableSelect />).asFragment()).toMatchSnapshot();
  });
});
