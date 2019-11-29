import React from "react";
import { render } from "tests/utils/rtl";

import { TableHead } from "./";

describe("TableHead", () => {
  it("should render", () => {
    const { asFragment } = render(
      <table>
        <TableHead />
      </table>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
