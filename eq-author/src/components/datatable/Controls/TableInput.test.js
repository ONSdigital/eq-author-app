import React from "react";
import { render } from "tests/utils/rtl";

import { TableInput } from "./";

describe("TableInput", () => {
  it("should render", () => {
    expect(render(<TableInput />).asFragment()).toMatchSnapshot();
  });
});
