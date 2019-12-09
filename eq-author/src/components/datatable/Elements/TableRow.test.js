import React from "react";
import { render } from "tests/utils/rtl";

import { TableRow } from "./";

describe("TableRow", () => {
  it("should render", () => {
    expect(
      render(
        <table>
          <tbody>
            <TableRow />
          </tbody>
        </table>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
