import React from "react";
import { render } from "tests/utils/rtl";

import { TableHeadColumn } from "./";

describe("TableHead", () => {
  it("should render", () => {
    const { asFragment } = render(
      <table>
        <tbody>
          <tr>
            <TableHeadColumn />
          </tr>
        </tbody>
      </table>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
