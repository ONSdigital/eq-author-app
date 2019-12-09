import React from "react";
import { render } from "tests/utils/rtl";

import { TableFoot } from "./";

describe("TableFoot", () => {
  it("should render", () => {
    expect(
      render(
        <table>
          <TableFoot />
        </table>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
