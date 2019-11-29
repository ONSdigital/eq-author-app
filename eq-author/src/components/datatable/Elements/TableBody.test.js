import React from "react";
import { render } from "tests/utils/rtl";

import { TableBody } from "./";

describe("TableBody", () => {
  it("should render", () => {
    expect(
      render(
        <table>
          <TableBody />
        </table>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
