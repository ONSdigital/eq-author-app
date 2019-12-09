import React from "react";
import { render } from "tests/utils/rtl";

import { TableColumn } from "./";

describe("TableColumn", () => {
  it("should render", () => {
    expect(
      render(
        <table>
          <tbody>
            <tr>
              <TableColumn />
            </tr>
          </tbody>
        </table>
      ).asFragment()
    ).toMatchSnapshot();
  });
});
