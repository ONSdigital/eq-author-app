import React from "react";
import { render } from "tests/utils/rtl";

import { Table } from "./";

describe("Table", () => {
  it("should render", () => {
    expect(render(<Table />).asFragment()).toMatchSnapshot();
  });
});
