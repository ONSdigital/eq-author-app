import React from "react";
import { render } from "tests/utils/rtl";

import { TableTypeaheadInput } from "./";

describe("TableTypeaheadInput", () => {
  it("should render", () => {
    expect(render(<TableTypeaheadInput />).asFragment()).toMatchSnapshot();
  });
});
